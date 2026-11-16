<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use App\Models\Pengguna;
use App\Models\PenjadwalanPengguna;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class KehadiranController extends Controller
{
    private const PER_HALAMAN = 8;

    public function index(Request $request): View
    {
        $karyawan = $this->karyawan($request);

        [$data, $ringkasan, $bulan] = $this->susunData($request, ! $karyawan);

        $tampil = [
            'riwayat' => $this->paginasi($data, $request),
            'ringkasan' => $ringkasan,
            'total' => $data->count(),
            'bulan' => $bulan->format('Y-m'),
            'periode' => '1 - ' . $bulan->copy()->endOfMonth()->translatedFormat('j F Y'),
            'status' => $request->input('status'),
        ];

        if ($karyawan) {
            return view('kehadiran.riwayat', $tampil);
        }

        $tampil['penggunas'] = Pengguna::whereHas('jabatan', fn ($q) => $q->where('nama', 'karyawan'))
            ->orderBy('nama')
            ->get();

        return view('kehadiran.rekap', $tampil);
    }

    public function unduh(Request $request): StreamedResponse
    {
        $semua = ! $this->karyawan($request);
        [$data, , $bulan] = $this->susunData($request, $semua);

        return response()->streamDownload(function () use ($data, $semua) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // BOM agar Excel membaca UTF-8

            $kepala = $semua
                ? ['Tanggal', 'Karyawan', 'Jam masuk', 'Jam pulang', 'Status', 'Keterangan']
                : ['Tanggal', 'Jam masuk', 'Jam pulang', 'Status', 'Keterangan'];
            fputcsv($out, $kepala, ',', '"', '\\');

            foreach ($data as $p) {
                $baris = [$p->tanggal->translatedFormat('l, d M Y')];
                if ($semua) {
                    $baris[] = $p->pengguna->nama;
                }
                array_push(
                    $baris,
                    $p->kehadiran?->waktu_masuk?->format('H:i') ?? '-',
                    $p->kehadiran?->waktu_keluar?->format('H:i') ?? '-',
                    $p->status_tampil,
                    $p->keterangan,
                );
                fputcsv($out, $baris, ',', '"', '\\');
            }

            fclose($out);
        }, 'riwayat-kehadiran-' . $bulan->format('Y-m') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function masuk(Request $request, PenjadwalanPengguna $penjadwalan): RedirectResponse
    {
        abort_unless((int) $penjadwalan->pengguna_id === (int) $request->user()->id, 403);

        $data = $request->validate($this->aturanLokasi(), $this->pesanLokasi());

        $penjadwalan->loadMissing(['status', 'kehadiran', 'jadwal']);

        if (! $penjadwalan->tanggal->isToday()) {
            return back()->withErrors(['absen' => 'Absen hanya dapat dilakukan pada tanggal jadwal.']);
        }

        if (! str_starts_with($penjadwalan->status->nama, 'Hadir')) {
            return back()->withErrors([
                'absen' => "Status jadwal Anda hari ini \"{$penjadwalan->status->nama}\", jadi tidak perlu absen.",
            ]);
        }

        if ($penjadwalan->kehadiran) {
            return back()->withErrors(['absen' => 'Anda sudah melakukan absen masuk hari ini.']);
        }

        Kehadiran::create([
            'penjadwalan_pengguna_id' => $penjadwalan->id,
            'waktu_masuk' => now(),
            'lokasi_masuk' => $data['latitude'] . ',' . $data['longitude'],
            'catatan' => $data['catatan'] ?? null,
        ]);

        $penjadwalan->load('kehadiran');
        $pesan = 'Absen masuk tercatat pukul ' . now()->format('H:i') . '.';
        if ($penjadwalan->terlambat) {
            $pesan .= ' Anda terlambat.';
        }

        return redirect()->route('dashboard')->with('success', $pesan);
    }

    public function keluar(Request $request, Kehadiran $kehadiran): RedirectResponse
    {
        $kehadiran->loadMissing('penjadwalan');

        abort_unless((int) $kehadiran->penjadwalan->pengguna_id === (int) $request->user()->id, 403);

        $data = $request->validate($this->aturanLokasi(), $this->pesanLokasi());

        if ($kehadiran->waktu_keluar) {
            return back()->withErrors(['absen' => 'Anda sudah melakukan absen pulang.']);
        }

        $kehadiran->update([
            'waktu_keluar' => now(),
            'lokasi_keluar' => $data['latitude'] . ',' . $data['longitude'],
            'catatan' => $data['catatan'] ?? $kehadiran->catatan,
        ]);

        return redirect()->route('dashboard')
            ->with('success', 'Absen pulang tercatat pukul ' . now()->format('H:i') . '.');
    }

    private function karyawan(Request $request): bool
    {
        return $request->user()->jabatan->nama === 'karyawan';
    }

    private function susunData(Request $request, bool $semua): array
    {
        $request->validate([
            'bulan' => ['nullable', 'date_format:Y-m'],
            'status' => ['nullable', 'in:hadir,terlambat,izin,sakit,tanpa-keterangan,terjadwal'],
            'pengguna_id' => ['nullable', 'integer'],
        ]);

        $bulan = Carbon::createFromFormat('!Y-m', $request->input('bulan', now()->format('Y-m')));

        $semuaData = PenjadwalanPengguna::with(['pengguna', 'jadwal', 'status', 'kehadiran'])
            ->whereBetween('tanggal', [
                $bulan->copy()->startOfMonth()->toDateString(),
                $bulan->copy()->endOfMonth()->toDateString(),
            ])
            ->when(
                $semua,
                fn ($q) => $q->when($request->pengguna_id, fn ($w, $id) => $w->where('pengguna_id', $id)),
                fn ($q) => $q->where('pengguna_id', $request->user()->id),
            )
            ->orderByDesc('tanggal')
            ->get();

        $hitung = $semuaData->countBy(fn ($p) => Str::slug($p->status_tampil));
        $ringkasan = [
            'hadir' => $hitung->get('hadir', 0),
            'terlambat' => $hitung->get('terlambat', 0),
            'izin' => $hitung->get('izin', 0),
            'sakit' => $hitung->get('sakit', 0),
            'tanpa_keterangan' => $hitung->get('tanpa-keterangan', 0),
        ];

        $filter = $request->input('status');
        $data = $filter
            ? $semuaData->filter(fn ($p) => Str::slug($p->status_tampil) === $filter)->values()
            : $semuaData;

        return [$data, $ringkasan, $bulan];
    }

    private function paginasi(Collection $data, Request $request): LengthAwarePaginator
    {
        $halaman = LengthAwarePaginator::resolveCurrentPage();

        return new LengthAwarePaginator(
            $data->forPage($halaman, self::PER_HALAMAN)->values(),
            $data->count(),
            self::PER_HALAMAN,
            $halaman,
            ['path' => $request->url(), 'query' => $request->query()],
        );
    }

    private function aturanLokasi(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'catatan' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function pesanLokasi(): array
    {
        return [
            'latitude.required' => 'Lokasi belum terdeteksi. Izinkan akses lokasi pada browser lalu coba lagi.',
            'longitude.required' => 'Lokasi belum terdeteksi. Izinkan akses lokasi pada browser lalu coba lagi.',
        ];
    }
}
