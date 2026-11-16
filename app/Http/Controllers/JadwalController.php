<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class JadwalController extends Controller
{
    public function index(): View
    {
        $jadwals = Jadwal::orderBy('jam_masuk')->paginate(10);

        return view('jadwal.index', compact('jadwals'));
    }

    public function create(): View
    {
        return view('jadwal.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->aturan());

        Jadwal::create($data);

        return redirect()->route('jadwal.index')
            ->with('success', 'Jadwal kerja berhasil ditambahkan.');
    }

    public function edit(Jadwal $jadwal): View
    {
        return view('jadwal.edit', compact('jadwal'));
    }

    public function update(Request $request, Jadwal $jadwal): RedirectResponse
    {
        $data = $request->validate($this->aturan());

        $jadwal->update($data);

        return redirect()->route('jadwal.index')
            ->with('success', 'Jadwal kerja berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal): RedirectResponse
    {
        if ($jadwal->penjadwalan()->exists()) {
            return back()->withErrors([
                'jadwal' => 'Jadwal ini masih dipakai pada penjadwalan karyawan, jadi tidak bisa dihapus.',
            ]);
        }

        $jadwal->delete();

        return redirect()->route('jadwal.index')
            ->with('success', 'Jadwal kerja berhasil dihapus.');
    }

    private function aturan(): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'jam_masuk' => ['required', 'date_format:H:i'],
            'jam_pulang' => ['required', 'date_format:H:i', 'after:jam_masuk'],
        ];
    }
}
