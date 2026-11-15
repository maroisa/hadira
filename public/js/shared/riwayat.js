/**
 * HADIRA — Riwayat untuk karyawan/admin, memakai sesi dan filter aktif.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// filteredHistory
function filteredHistory() {
    let r = session.role === 'admin' ? db.history : myRows();
    return r.filter(x => (!filters.month || x.date.startsWith(filters.month)) && (!filters.status ||
        x.status === filters.status) && (!filters.employee || x.employeeId === filters
        .employee)).sort(sortRows)
}

// historyPage
function historyPage() {
    let admin = session.role === 'admin',
        rows = filteredHistory(),
        start = (pageNo - 1) * 8;
    return heading('Riwayat absensi', admin ? 'Rekap kehadiran seluruh tim, dalam satu tampilan.' :
        'Lihat dan pantau catatan kehadiranmu dengan mudah.', admin ? '' : `<button class="btn primary" data-action="request-leave">${icon('plus')} Ajukan izin</button>`) + (
        !admin ? statsFor(myRows()) : '') + `<section class="card">` +
        `<div class="table-header between">` +
        `<div>` +
        `<h2>Catatan kehadiran</h2>` +
        `<p>Transparan, rapi, dan mudah ditelusuri.</p>` +
        `</div>` +
        `<button class="btn outline" data-action="export-history">${icon('download')} Unduh laporan</button>` +
        `</div>` +
        `<div class="filters">` +
        `<input type="month" id="month-filter" aria-label="Filter bulan" value="${esc(filters.month)}">` +
        `<select id="status-filter" aria-label="Filter status">` +
        `<option value="">Semua status</option>${['Hadir','Terlambat','Izin','Sakit'].map(s=>`<option ${filters.status===s?'selected':''}>${s}</option>`).join('')}</select>${admin?`<select id="employee-filter" aria-label="Filter karyawan"><option value="">Semua karyawan</option>${db.employees.map(e=>`<option value="${esc(e.id)}" ${filters.employee===e.id?'selected':''}>${esc(e.name)}</option>`).join('')}</select>`:''}<button class="btn outline" data-action="reset-filters">Reset</button>` +
        `</div>${historyTable(rows.slice(start,start+8),admin)}${pagination(rows.length,start,8)}</section>` +
        `<div class="tip">${icon('help')}Ada data yang kurang sesuai? Hubungi HR untuk pengecekan kehadiran.<a href="#help" data-action="help">Hubungi HR ↗</a>` +
        `</div>`
}
