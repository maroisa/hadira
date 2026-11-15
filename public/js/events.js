/**
 * HADIRA — Pemasangan event tombol, pencarian dan filter setelah render ulang.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// bind
function bind() {
    document.querySelectorAll('[data-nav],[data-link]').forEach(b => b.onclick = e => {
        e.preventDefault();
        navigate(b.dataset.nav || b.dataset.link)
    });
    document.querySelectorAll('[data-paginate]').forEach(b => b.onclick = () => {
        pageNo = Number(b.dataset.paginate);
        render()
    });
    document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => employeeForm(b.dataset
        .edit));
    document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => viewEmployee(b.dataset
        .view));
    document.querySelectorAll('[data-delete]').forEach(b => b.onclick = () => deleteEmployee(b
        .dataset.delete));
    document.querySelectorAll('[data-action]').forEach(b => b.onclick = e => {
        e.preventDefault();
        let a = b.dataset.action;
        if (a === 'logout') {
            logout()
        }
        if (a === 'help') openModal(`<h2>Halo, ada yang bisa dibantu?</h2>` +
        `<p>Catat absen masuk saat memulai kerja dan absen pulang setelah selesai. Gunakan menu Riwayat untuk melihat atau mengunduh catatan. Hubungi tim HR perusahaan untuk koreksi data.</p>` +
        `<div class="notice">Ini frontend demo. Akun, lokasi, dan informasi perusahaan merupakan data contoh.</div>` +
        `<div class="actions">` +
        `<button class="btn" data-close>Mengerti</button>` +
        `</div>`);
        if (a === 'notifications') toast(
            'Tidak ada notifikasi baru. Semua catatanmu sudah tersimpan.');
        if (a === 'attendance') attendance();
        if (a === 'add-employee') employeeForm();
        if (a === 'request-leave') requestLeave();
        if (a === 'reset-filters') {
            filters = {
                q: '',
                department: '',
                status: '',
                month: '',
                employee: ''
            };
            pageNo = 1;
            render()
        }
        if (a === 'export-employees') csv('HADIRA-karyawan.csv', ['ID', 'Nama', 'Email',
            'Departemen', 'Jabatan', 'Status'
        ], employeeList().map(x => [x.id, x.name, x.email, x.department, x.position,
            x.status
        ]));
        if (a === 'export-history') csv('HADIRA-riwayat-absensi.csv', ['Tanggal',
            'ID karyawan', 'Nama', 'Masuk', 'Pulang', 'Status', 'Keterangan'
        ], filteredHistory().map(x => [x.date, x.employeeId, db.employees.find(e =>
                e.id === x.employeeId)?.name || '', x.in, x.out, x.status, x
            .note
        ]));
    });
    [
        ['#department-filter', 'department'],
        ['#status-filter', 'status'],
        ['#month-filter', 'month'],
        ['#employee-filter', 'employee']
    ].forEach(([s, k]) => {
        let el = $(s);
        if (el) el.onchange = () => {
            filters[k] = el.value;
            pageNo = 1;
            render()
        }
    });
    if ($('#search')) $('#search').oninput = e => {
        let pos = e.target.selectionStart;
        filters.q = e.target.value;
        pageNo = 1;
        render();
        $('#search').focus();
        $('#search').setSelectionRange(pos, pos)
    };
}
