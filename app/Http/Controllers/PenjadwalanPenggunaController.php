<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Pengguna;
use App\Models\PenjadwalanPengguna;
use App\Models\StatusJadwal;
use Carbon\CarbonPeriod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PenjadwalanPenggunaController extends Controller
{
    public function index(Request $request): View
    {
        $request->validate([
            'dari' => ['nullable', 'date'],
            'sampai' => ['nullable', 'date', 'after_or_equal:dari'],
        ]);

        $dari = $request->input('dari', today()->startOfMonth()->toDateString());
        $sampai = $request->input('sampai', today()->endOfMonth()->toDateString());

        $penjadwalans = PenjadwalanPengguna::with(['pengguna', 'jadwal', 'status', 'kehadiran'])
            ->whereBetween('tanggal', [$dari, $sampai])
            ->when($request->pengguna_id, fn ($q, $id) => $q->where('pengguna_id', $id))
            ->when($request->jadwal_id, fn ($q, $id) => $q->where('jadwal_id', $id))
            ->when($request->status_id, fn ($q, $id) => $q->where('status_id', $id))
            ->orderByDesc('tanggal')
            ->paginate(15)
            ->withQueryString();

        return view('penjadwalan.index', $this->pilihan() + compact('penjadwalans', 'dari', 'sampai'));
    }

    public function create(): View
    {
        return view('penjadwalan.create', $this->pilihan());
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge(['pengguna_id' => (array) $request->input('pengguna_id', [])]);

        $data = $request->validate([
            'pengguna_id' => ['required', 'array', 'min:1'],
            'pengguna_id.*' => ['integer', 'exists:penggunas,id'],
            'jadwal_id' => ['required', 'exists:jadwals,id'],
            'status_id' => ['required', 'exists:status_jadwals,id'],
            'tanggal' => ['required', 'date'],
            'tanggal_selesai' => ['nullable', 'date', 'after_or_equal:tanggal'],
        ]);

        $periode = CarbonPeriod::create($data['tanggal'], $data['tanggal_selesai'] ?? $data['tanggal']);

        if ($periode->count() > 31) {
            return back()->withInput()->withErrors([
                'tanggal_selesai' => 'Rentang tanggal maksimal 31 hari.',
            ]);
        }

        $dibuat = 0;
        $dilewati = 0;

        DB::transaction(function () use ($data, $periode, &$dibuat, &$dilewati) {
            foreach ($data['pengguna_id'] as $penggunaId) {
                foreach ($periode as $tanggal) {
                    $sudahAda = PenjadwalanPengguna::where('pengguna_id', $penggunaId)
                        ->whereDate('tanggal', $tanggal)
                        ->exists();

                    if ($sudahAda) {
                        $dilewati++;
                        continue;
                    }

                    PenjadwalanPengguna::create([
                        'pengguna_id' => $penggunaId,
                        'jadwal_id' => $data['jadwal_id'],
                        'status_id' => $data['status_id'],
                        'tanggal' => $tanggal->toDateString(),
                    ]);
                    $dibuat++;
                }
            }
        });

        $pesan = "{$dibuat} jadwal berhasil ditugaskan.";
        if ($dilewati > 0) {
            $pesan .= " {$dilewati} dilewati karena karyawan sudah punya jadwal di tanggal tersebut.";
        }

        return redirect()->route('penjadwalan.index')->with('success', $pesan);
    }

    public function edit(PenjadwalanPengguna $penjadwalan): View
    {
        $penjadwalan->load('pengguna');

        return view('penjadwalan.edit', $this->pilihan() + compact('penjadwalan'));
    }

    public function update(Request $request, PenjadwalanPengguna $penjadwalan): RedirectResponse
    {
        $data = $request->validate([
            'jadwal_id' => ['required', 'exists:jadwals,id'],
            'status_id' => ['required', 'exists:status_jadwals,id'],
            'tanggal' => [
                'required',
                'date',
                Rule::unique('penjadwalan_penggunas', 'tanggal')
                    ->where('pengguna_id', $penjadwalan->pengguna_id)
                    ->ignore($penjadwalan->id),
            ],
        ]);

        if ($penjadwalan->kehadiran()->exists()
            && $data['tanggal'] !== $penjadwalan->tanggal->toDateString()) {
            return back()->withInput()->withErrors([
                'tanggal' => 'Tanggal tidak dapat diubah karena karyawan sudah melakukan absensi.',
            ]);
        }

        $penjadwalan->update($data);

        return redirect()->route('penjadwalan.index')
            ->with('success', 'Penjadwalan berhasil diperbarui.');
    }

    public function destroy(PenjadwalanPengguna $penjadwalan): RedirectResponse
    {
        if ($penjadwalan->kehadiran()->exists()) {
            return back()->withErrors([
                'penjadwalan' => 'Jadwal ini sudah memiliki data kehadiran, jadi tidak bisa dihapus.',
            ]);
        }

        $penjadwalan->delete();

        return redirect()->route('penjadwalan.index')
            ->with('success', 'Penjadwalan berhasil dihapus.');
    }

    public function saya(Request $request): View
    {
        $jadwalSaya = PenjadwalanPengguna::with(['jadwal', 'status', 'kehadiran'])
            ->where('pengguna_id', $request->user()->id)
            ->whereDate('tanggal', '>=', today())
            ->orderBy('tanggal')
            ->paginate(15);

        return view('penjadwalan.saya', compact('jadwalSaya'));
    }

    private function pilihan(): array
    {
        return [
            'penggunas' => Pengguna::where('aktif', true)
                ->whereHas('jabatan', fn ($q) => $q->where('nama', 'karyawan'))
                ->orderBy('nama')
                ->get(),
            'jadwals' => Jadwal::orderBy('jam_masuk')->get(),
            'statuses' => StatusJadwal::orderBy('id')->get(),
        ];
    }
}
