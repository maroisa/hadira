/**
 * HADIRA — Komponen kartu, tabel, badge dan pagination.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// badge
const badge = s => `<span class="badge ${s.toLowerCase()}">${esc(s)}</span>`;

// heading
function heading(title, sub, action = '') {
    return `<div class="heading between">` +
        `<div>` +
        `<h1>${title}</h1>` +
        `<p>${sub}</p>` +
        `</div>${action||`<div class="date-label">${icon('calendar')}${fullDate()}</div>`}</div>`
}

// stat
function stat(label, num, unit, i, color = 'var(--teal-500)') {
    return `<article class="card stat">` +
        `<div class="stat-top">` +
        `<span>${label}</span>` +
        `<span style="color:${color}">${icon(i)}</span>` +
        `</div>` +
        `<div class="stat-number">${num}<small>${unit}</small>` +
        `</div>` +
        `<div class="stat-line" style="background:${color}">` +
        `</div>` +
        `</article>`
}

// statsFor
function statsFor(rows) {
    let m = today().slice(0, 7);
    let r = rows.filter(x => x.date.startsWith(m));
    return `<div class="stats">${stat('Hadir',r.filter(x=>x.status==='Hadir').length,'hari','calendar','#2E9E6B')}${stat('Terlambat',r.filter(x=>x.status==='Terlambat').length,'hari','clock','#D98A12')}${stat('Izin',r.filter(x=>x.status==='Izin').length,'hari','file')}${stat('Sakit',r.filter(x=>x.status==='Sakit').length,'hari','profile','#8A5CC2')}</div>`
}

// historyTable
function historyTable(rows, admin) {
    return `<div class="table-scroll">` +
        `<table>` +
        `<thead>` +
        `<tr>${admin?'<th>Karyawan</th>':''}<th>Tanggal</th>` +
        `<th>Jam masuk</th>` +
        `<th>Jam pulang</th>` +
        `<th>Status</th>` +
        `<th>Keterangan</th>` +
        `</tr>` +
        `</thead>` +
        `<tbody>${rows.map(r=>`<tr>${admin?`<td>${esc(db.employees.find(x=>x.id===r.employeeId)?.name||'Karyawan dihapus')}</td>`:''}<td>${dateText(r.date)}</td><td>${esc(r.in)}</td><td>${esc(r.out)}</td><td>${badge(r.status)}</td><td>${esc(r.note)}</td></tr>`).join('')}</tbody>` +
        `</table>` +
        `</div>${!rows.length?empty('Belum ada catatan kehadiran','Absensi yang tercatat akan muncul di sini.'):''}`
}

// pagination
function pagination(total, start, size = 6) {
    let count = Math.max(1, Math.ceil(total / size));
    return `<div class="table-footer">` +
        `<span>Menampilkan ${total?start+1:0}–${Math.min(start+size,total)} dari ${total} data</span>` +
        `<div class="pagination">` +
        `<button data-paginate="${pageNo-1}" ${pageNo===1?'disabled':''} aria-label="Halaman sebelumnya">‹</button>` +
        `<button class="current" aria-current="page">${pageNo}</button>` +
        `<button data-paginate="${pageNo+1}" ${pageNo>=count?'disabled':''} aria-label="Halaman berikutnya">›</button>` +
        `</div>` +
        `</div>`
}

// empty
function empty(title, sub) {
    return `<div class="empty">${icon('file')}<h3>${title}</h3>` +
        `<p>${sub}</p>` +
        `</div>`
}
