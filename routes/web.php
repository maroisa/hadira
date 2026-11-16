<?php

use Illuminate\Support\Facades\Route;

$pages = [
    'login' => ['/', 'Login — HADIRA', 'login', ''],
    'admin.home' => ['/admin/dashboard', 'Dashboard — HADIRA', 'home', 'admin'],
    'admin.employees' => ['/admin/karyawan', 'Kelola karyawan — HADIRA', 'employees', 'admin'],
    'admin.history' => ['/admin/riwayat', 'Riwayat absensi — HADIRA', 'history', 'admin'],
    'admin.profile' => ['/admin/profil', 'Profil — HADIRA', 'profile', 'admin'],
    'employee.home' => ['/karyawan/dashboard', 'Dashboard — HADIRA', 'home', 'employee'],
    'employee.history' => ['/karyawan/riwayat', 'Riwayat absensi — HADIRA', 'history', 'employee'],
    'employee.profile' => ['/karyawan/profil', 'Profil — HADIRA', 'profile', 'employee'],
];

Route::name('hadira.')->group(function () use ($pages) {
    foreach ($pages as $name => [$path, $title, $page, $role]) {
        Route::view($path, 'page', compact('title', 'page', 'role'))->name($name);
    }
});