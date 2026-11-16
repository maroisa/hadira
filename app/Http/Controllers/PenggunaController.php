<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
use App\Models\Pengguna;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class PenggunaController extends Controller
{
    public function index(Request $request): View
    {
        $penggunas = Pengguna::with('jabatan')
            ->when($request->q, fn ($query, $cari) => $query->where(
                fn ($w) => $w->where('nama', 'like', "%{$cari}%")->orWhere('email', 'like', "%{$cari}%")
            ))
            ->when($request->jabatan_id, fn ($query, $id) => $query->where('jabatan_id', $id))
            ->when($request->filled('aktif'), fn ($query) => $query->where('aktif', $request->boolean('aktif')))
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        $jabatans = Jabatan::orderBy('id')->get();

        return view('pengguna.index', compact('penggunas', 'jabatans'));
    }

    public function create(): View
    {
        $jabatans = Jabatan::orderBy('id')->get();

        return view('pengguna.create', compact('jabatans'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->aturan());

        $data['password'] = Hash::make($data['password']);
        $data['aktif'] = $request->boolean('aktif');

        Pengguna::create($data);

        return redirect()->route('pengguna.index')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(Pengguna $pengguna): View
    {
        $jabatans = Jabatan::orderBy('id')->get();

        return view('pengguna.edit', compact('pengguna', 'jabatans'));
    }

    public function update(Request $request, Pengguna $pengguna): RedirectResponse
    {
        $data = $request->validate($this->aturan($pengguna));

        if ($pengguna->is($request->user())
            && ((int) $data['jabatan_id'] !== (int) $pengguna->jabatan_id || ! $request->boolean('aktif'))) {
            return back()->withInput()->withErrors([
                'jabatan_id' => 'Anda tidak dapat mengubah jabatan atau menonaktifkan akun Anda sendiri.',
            ]);
        }

        if (! empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        $data['aktif'] = $request->boolean('aktif');

        $pengguna->update($data);

        return redirect()->route('pengguna.index')
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    public function destroy(Request $request, Pengguna $pengguna): RedirectResponse
    {
        if ($pengguna->is($request->user())) {
            return back()->withErrors(['pengguna' => 'Anda tidak dapat menghapus akun Anda sendiri.']);
        }

        if ($pengguna->penjadwalan()->exists()) {
            return back()->withErrors([
                'pengguna' => 'Pengguna sudah memiliki jadwal. Nonaktifkan saja akunnya.',
            ]);
        }

        $pengguna->delete();

        return redirect()->route('pengguna.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }

    private function aturan(?Pengguna $pengguna = null): array
    {
        return [
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('penggunas', 'email')->ignore($pengguna?->id)],
            'telepon' => ['required', 'string', 'max:16', 'regex:/^[0-9+\-\s]+$/'],
            'password' => $pengguna
                ? ['nullable', 'string', 'min:8', 'confirmed']
                : ['required', 'string', 'min:8', 'confirmed'],
            'jabatan_id' => ['required', 'exists:jabatans,id'],
            'aktif' => ['nullable', 'boolean'],
        ];
    }
}
