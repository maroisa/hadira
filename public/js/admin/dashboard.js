/**
 * HADIRA — Tampilan ringkasan, grafik dan aktivitas admin.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// adminHome
function adminHome() {
    let active = db.employees.filter(x => x.status === 'Aktif').length;
    let rows = db.history.filter(x => x.date === today());
    return heading('Selamat pagi, Adea.', 'Satu tempat untuk tim yang hadir dan terus bertumbuh.',
        `<button class="btn primary" data-nav="employees">${icon('users')} Kelola karyawan</button>`) + `<div class="stats">${stat('Total karyawan',db.employees.length,'orang','users')}${stat('Hadir hari ini',rows.filter(x=>['Hadir','Terlambat'].includes(x.status)).length,'orang','calendar','#2E9E6B')}${stat('Izin & sakit',rows.filter(x=>['Izin','Sakit'].includes(x.status)).length,'orang','file','#D98A12')}${stat('Karyawan aktif',active,'orang','profile')}</div>` +
        `<div class="summary-layout">` +
        `<section class="card">` +
        `<div class="between">` +
        `<div>` +
        `<h2>Kehadiran tim</h2>` +
        `<small>7 hari terakhir · hadir dan terlambat</small>` +
        `</div>` +
        `<span class="badge izin">${active} karyawan aktif</span>` +
        `</div>` +
        `<div class="chart">${Array.from({length:7},(_,i)=>{let d=new Date();d.setDate(d.getDate()-6+i);let key=d.toLocaleDateString('sv-SE');let count=db.history.filter(r=>r.date===key&&['Hadir','Terlambat'].includes(r.status)).length;return `<div class="chart-col"><span>${count}</span><div class="chart-bar" style="height:${Math.max(3,count/Math.max(1,db.employees.length)*90)}px"></div><span>${d.toLocaleDateString('id-ID',{weekday:'short'})}</span></div>`}).join('')}</div>` +
        `</section>` +
        `<section class="card">` +
        `<h2>Aktivitas terbaru</h2>` +
        `<small>Perubahan terakhir di workspace ini</small>${db.activities.length?db.activities.slice(0,3).map(a=>`<div class="activity"><span class="icon-wrap">${icon('history')}</span><div><p>${esc(a.message)}</p><small>${esc(a.at)}</small></div></div>`).join(''):'<div class="activity"><span class="icon-wrap">'+icon('check')+'</span><div><p>Workspace siap digunakan</p><small>Aktivitas CRUD dan absensi akan muncul di sini.</small></div></div>'}</section>` +
        `</div>` +
        `<section class="card">` +
        `<div class="table-header between">` +
        `<div>` +
        `<h2>Absensi hari ini</h2>` +
        `<p>Pantau kehadiran seluruh tim secara langsung.</p>` +
        `</div>` +
        `<a href="#history" data-link="history" class="caption">Buka riwayat →</a>` +
        `</div>${historyTable(rows,true)}</section>` +
        `<div class="tip">${icon('help')}Tim yang hebat dimulai dari kehadiran yang bermakna.<a href="#employees" data-link="employees">Lihat tim ↗</a>` +
        `</div>`
}
