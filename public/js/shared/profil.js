/**
 * HADIRA — Tampilan profil bersama berdasarkan peran login.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// profilePage
function profilePage(me) {
    let admin = session.role === 'admin';
    return heading('Profil saya', 'Kenali informasi akun dan ruang kerjamu.') + `<section class="card profile">` +
        `<span class="avatar">${admin?'AA':esc(initials(me.name))}</span>` +
        `<h2>${admin?'Ade Amanah':esc(me.name)}</h2>` +
        `<p class="muted caption" style="margin:6px 0 25px">${admin?'Administrator':esc(me.position)} · ${badge('Aktif')}</p>` +
        `<div class="profile-grid">${[['ID karyawan',admin?'ADM001':me.id],['Email',admin?'admin@hadira.id':me.email],['Departemen',admin?'Human Resources':me.department],['Lokasi kantor','Kantor pusat · Jakarta'],['Jam kerja','08:00–17:00 WIB'],['Peran akun',admin?'Administrator':'Karyawan']].map(([k,v])=>`<div><small>${k}</small><p>${esc(v)}</p></div>`).join('')}</div>` +
        `<div class="tip">${icon('help')}Perubahan informasi profil dapat dilakukan oleh admin.</div>` +
        `<button class="btn outline" style="margin-top:20px" data-action="logout">${icon('logout')} Keluar dari akun</button>` +
        `</section>`
}
