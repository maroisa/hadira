/**
 * HADIRA — Tampilan dashboard karyawan dan pembaruan jam.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// employeeHome
function employeeHome(me) {
    let r = myRows().find(x => x.date === today());
    return heading('Dashboard', 'Sedikit langkah hari ini, dampak besar esok hari.') +
        `<div class="hero-grid">` +
        `<section class="hero">` +
        `<div>` +
        `<span class="caption">${fullDate()}</span>` +
        `<h2>Selamat bekerja, ${esc(me.name.split(' ')[0])}! <span style="color:#ffe5a0">✦</span>` +
        `</h2>` +
        `<p>Semangat baru untuk ide-ide hebat.<br>Yuk, buat hari ini lebih berarti.</p>` +
        `<span class="location">${icon('pin')} Kantor pusat · Jakarta</span>` +
        `</div>${artwork()}</section>` +
        `<section class="card attendance">` +
        `<div class="between">` +
        `<h3>Status hari ini</h3>${r?badge(r.status):'<span class="badge cuti">Belum absen</span>'}</div>` +
        `<div class="clock" id="live-clock">${time()}</div>` +
        `<div class="between caption">` +
        `<span>Masuk <strong>${esc(r?.in||'—')}</strong>` +
        `</span>` +
        `<span>Pulang <strong>${esc(r?.out||'—')}</strong>` +
        `</span>` +
        `</div>` +
        `<button class="btn primary" data-action="attendance" ${r&&(!['Hadir','Terlambat'].includes(r.status)||r.out!=='—')?'disabled':''}>${icon('clock')}${!r?'Absen masuk':r.out==='—'&&['Hadir','Terlambat'].includes(r.status)?'Absen pulang':'Absensi tercatat'}</button>` +
        `<small>Jam kerja 08:00 – 17:00 WIB · Senin–Jumat</small>` +
        `</section>` +
        `</div>` +
        `<div class="section-title between">` +
        `<h3>Ringkasan bulan ini</h3>` +
        `<small>${new Date().toLocaleDateString('id-ID',{month:'long',year:'numeric'})}</small>` +
        `</div>${statsFor(myRows())}<section class="card">` +
        `<div class="table-header between">` +
        `<div>` +
        `<h2>Absensi terbaru</h2>` +
        `<p>Perjalanan produktifmu, tercatat di sini.</p>` +
        `</div>` +
        `<a href="#history" data-link="history" class="caption">Lihat semua riwayat →</a>` +
        `</div>${historyTable(myRows().sort(sortRows).slice(0,5),false)}</section>` +
        `<div class="tip">${icon('help')}Jangan lupa absen pulang sebelum meninggalkan kantor. Semangat bekerja!<a href="#help" data-action="help">Panduan absensi ↗</a>` +
        `</div>`
}

// updateClock
function updateClock() {
    let c = $('#live-clock');
    if (c) c.textContent = time()
}
