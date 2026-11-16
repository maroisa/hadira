<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use App\Models\Pengguna;
use App\Models\PenjadwalanPengguna;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function __invoke(Request $request): View
    {
        $pengguna = $request->user();

        if (in_array($pengguna->jabatan->nama, ['admin', 'manager'], true)) {
            return $this->untukAdmin();
        }

        return $this->untukKaryawan($pengguna);
    }

    private function untukKaryawan(Pengguna $pengguna): View
    {
        $milikSaya = fn () => PenjadwalanPengguna::with(['jadwal', 'status', 'kehadiran'])
            ->where('pengguna_id', $pengguna->id);

        $hariIni = $milikSaya()->whereDate('tanggal', today())->first();

        $aksi = 'tidak_ada';
        if ($hariIni) {
            if (! str_starts_with($hariIni->status->nama, 'Hadir')) {
                $aksi = 'libur'; // izin atau sakit
            } elseif (! $hariIni->kehadiran) {
                $aksi = 'masuk';
            } elseif (! $hariIni->kehadiran->waktu_keluar) {
                $aksi = 'keluar';
            } else {
                $aksi = 'selesai';
            }
        }

        $bulanIni = $milikSaya()
            ->whereBetween('tanggal', [today()->startOfMonth()->toDateString(), today()->endOfMonth()->toDateString()])
            ->get();
        $hitung = $bulanIni->countBy(fn ($p) => Str::slug($p->status_tampil));

        $izinTahunIni = PenjadwalanPengguna::where('pengguna_id', $pengguna->id)
            ->whereYear('tanggal', today()->year)
            ->whereHas('status', fn ($q) => $q->where('nama', 'Izin'))
            ->count();

        $ringkasan = [
            'hadir' => $hitung->get('hadir', 0),
            'terlambat' => $hitung->get('terlambat', 0),
            'izin' => $hitung->get('izin', 0),
            'sisa_cuti' => max(0, config('absensi.jatah_cuti') - $izinTahunIni),
        ];

        $terbaru = $milikSaya()
            ->whereDate('tanggal', '<=', today())
            ->orderByDesc('tanggal')
            ->limit(4)
            ->get();

        $jam = now()->hour;
        $salam = match (true) {
            $jam < 11 => 'pagi',
            $jam < 15 => 'siang',
            $jam < 18 => 'sore',
            default => 'malam',
        };

        return view('dashboard.karyawan', [
            'salam' => $salam,
            'namaDepan' => Str::of($pengguna->nama)->explode(' ')->first(),
            'tanggal' => now()->translatedFormat('l, d F Y'),
            'lokasiKantor' => config('absensi.lokasi_kantor'),
            'hariIni' => $hariIni,
            'aksi' => $aksi,
            'ringkasan' => $ringkasan,
            'terbaru' => $terbaru,
        ]);
    }

    private function untukAdmin(): View
    {
        $jadwalHariIni = PenjadwalanPengguna::whereDate('tanggal', today());

        $ringkasan = [
            'total_karyawan' => Pengguna::where('aktif', true)
                ->whereHas('jabatan', fn ($q) => $q->where('nama', 'karyawan'))
                ->count(),
            'sudah_absen' => (clone $jadwalHariIni)->has('kehadiran')->count(),
            'belum_absen' => (clone $jadwalHariIni)->doesntHave('kehadiran')
                ->whereHas('status', fn ($q) => $q->where('nama', 'like', 'Hadir%'))
                ->count(),
            'izin_sakit' => (clone $jadwalHariIni)
                ->whereHas('status', fn ($q) => $q->whereIn('nama', ['Izin', 'Sakit']))
                ->count(),
        ];

        $kehadiranTerbaru = Kehadiran::with('penjadwalan.pengguna', 'penjadwalan.jadwal')
            ->whereHas('penjadwalan', fn ($q) => $q->whereDate('tanggal', today()))
            ->latest('waktu_masuk')
            ->limit(10)
            ->get();

        return view('dashboard.admin', compact('ringkasan', 'kehadiranTerbaru'));
    }
}
