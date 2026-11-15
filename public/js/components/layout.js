/**
 * HADIRA — Kerangka sidebar, topbar, footer dan pemeriksaan peran demo.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// brand
function brand() {
    return `<div class="brand">` +
        `<span class="brand-mark">${icon('check')}</span>` +
        `<span>HADIRA<small>EVERY PRESENCE MATTERS</small>` +
        `</span>` +
        `</div>`
}

// render
function render() {
    if (!session) {
        location.replace(hadiraRoutes.login);
        return
    }
    let admin = session.role === 'admin';
    let me = db.employees.find(e => e.id === session.employeeId);
    if (!admin && (!me || me.status !== 'Aktif')) {
        logout();
        return
    }
    if (document.body.dataset.role !== session.role) {
        location.replace(pageUrl('home'));
        return
    }
    let name = admin ? 'Ade Amanah' : me.name;
    let nav = [
        ['home', 'home', 'Beranda'], ...(admin ? [
            ['employees', 'users', 'Karyawan']
        ] : []), ['history', 'history', 'Riwayat'],
        ['profile', 'profile', 'Profil']
    ];
    $('#app').innerHTML = `<div class="shell">` +
        `<aside class="sidebar">${brand()}<nav class="side-nav" aria-label="Navigasi utama">${nav.map(([p,i,l])=>`<button class="nav-item ${page===p?'active':''}" data-nav="${p}" ${page===p?'aria-current="page"':''}><span class="icon-wrap">${icon(i)}</span>${l}</button>`).join('')}</nav>` +
        `<div class="sidebar-bottom">` +
        `<button class="nav-item" data-action="help">${icon('help')}Bantuan</button>` +
        `<button class="nav-item" data-action="logout">${icon('logout')}Keluar</button>` +
        `</div>` +
        `</aside>` +
        `<div class="workspace">` +
        `<header class="topbar">` +
        `<div class="top-tabs">` +
        `<span class="active">Workspace</span>` +
        `<span>${admin?'Administrasi':'Kehadiran saya'}</span>` +
        `<span class="caption">${admin?'Admin':'Karyawan'}</span>` +
        `</div>` +
        `<div class="user">` +
        `<button class="icon-btn notification" data-action="notifications" aria-label="Notifikasi">${icon('bell')}</button>` +
        `<span class="avatar">${initials(name)}</span>` +
        `<div>` +
        `<strong>${esc(name)}</strong>` +
        `<small>${admin?'Administrator':esc(me.position)}</small>` +
        `</div>` +
        `<button class="icon-btn" data-action="logout" aria-label="Keluar">${icon('logout')}</button>` +
        `</div>` +
        `</header>` +
        `<main class="content">${renderPage(me)}<footer class="footer between">` +
        `<span>© ${new Date().getFullYear()} HADIRA. Setiap kehadiran berarti.</span>` +
        `<span>Frontend demo · <span style="color:#2E9E6B">●</span> Tersimpan lokal</span>` +
        `</footer>` +
        `</main>` +
        `</div>` +
        `</div>`;
    bind();
    updateClock();
}
