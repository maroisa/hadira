@php
    $routes = [
        'login' => route('hadira.login'),
        'admin.home' => route('hadira.admin.home'),
        'admin.employees' => route('hadira.admin.employees'),
        'admin.history' => route('hadira.admin.history'),
        'admin.profile' => route('hadira.admin.profile'),
        'employee.home' => route('hadira.employee.home'),
        'employee.history' => route('hadira.employee.history'),
        'employee.profile' => route('hadira.employee.profile'),
    ];
@endphp
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#4B6B7C">
    <title>{{ $title }}</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <script defer src="{{ asset('js/shared/utils.js') }}"></script>
    <script defer src="{{ asset('js/components/icons.js') }}"></script>
    <script defer src="{{ asset('js/components/illustration.js') }}"></script>
    <script defer src="{{ asset('js/data/seed.js') }}"></script>
    <script defer src="{{ asset('js/data/storage.js') }}"></script>
    <script defer src="{{ asset('js/components/feedback.js') }}"></script>
    <script defer src="{{ asset('js/components/ui.js') }}"></script>
    <script defer src="{{ asset('js/components/layout.js') }}?v=2"></script>
    <script defer src="{{ asset('js/auth.js') }}"></script>
    <script defer src="{{ asset('js/karyawan/dashboard.js') }}"></script>
    <script defer src="{{ asset('js/karyawan/absensi.js') }}"></script>
    <script defer src="{{ asset('js/admin/dashboard.js') }}?v=2"></script>
    <script defer src="{{ asset('js/admin/karyawan.js') }}"></script>
    <script defer src="{{ asset('js/shared/riwayat.js') }}"></script>
    <script defer src="{{ asset('js/shared/profil.js') }}?v=2"></script>
    <script defer src="{{ asset('js/navigation.js') }}"></script>
    <script defer src="{{ asset('js/events.js') }}"></script>
    <script defer src="{{ asset('js/app.js') }}"></script>
</head>
<body data-page="{{ $page }}" data-role="{{ $role }}"
      data-routes="{{ json_encode($routes, JSON_THROW_ON_ERROR) }}">
    <div id="app"></div>
    <div id="toast" role="status" aria-live="polite"></div>
    <dialog id="modal"></dialog>
    <noscript>Aktifkan JavaScript untuk menggunakan frontend demo HADIRA.</noscript>
</body>
</html>
