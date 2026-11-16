<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function showLogin(Request $request): View
    {
        return view('auth.login', ['peran' => $request->query('peran', 'karyawan')]);
    }

    public function login(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'peran' => ['nullable', Rule::in(['karyawan', 'admin'])],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Kata sandi wajib diisi.',
        ]);

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('ingat'))) {
            return back()
                ->withErrors(['email' => 'Email atau kata sandi salah.'])
                ->onlyInput('email', 'peran');
        }

        $request->session()->regenerate();
        $pengguna = $request->user();

        if (! $pengguna->aktif) {
            return $this->tolak($request, 'Akun Anda tidak aktif. Hubungi HR.');
        }

        $peran = $request->input('peran', 'karyawan');
        $jabatan = $pengguna->jabatan->nama;
        $sesuai = $peran === 'admin'
            ? in_array($jabatan, ['admin', 'manager'], true)
            : $jabatan === 'karyawan';

        if (! $sesuai) {
            return $this->tolak($request, $peran === 'admin'
                ? 'Akun ini bukan akun admin. Pilih tab Karyawan.'
                : 'Akun ini bukan akun karyawan. Pilih tab Admin.');
        }

        return redirect()->intended(route('dashboard'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function tolak(Request $request, string $pesan): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return back()->withErrors(['email' => $pesan])->onlyInput('email', 'peran');
    }
}
