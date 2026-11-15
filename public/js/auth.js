/**
 * HADIRA — Tampilan login dan validasi akun demo. Belum autentikasi server.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// login
function login() {
    $('#app').innerHTML = `<main class="login">` +
        `<section class="login-story">${brand()}<div class="story-copy">` +
        `<div class="eyebrow">Langkah kecil, dampak besar.</div>` +
        `<h1>Setiap kehadiran<br>punya arti.</h1>` +
        `<p>Mulai hari dengan lebih teratur. Catat kehadiran dengan mudah, fokus pada hal yang berarti.</p>` +
        `</div>${artwork()}<div class="story-bottom">` +
        `<span>Hadir. Terhubung. Bertumbuh.</span>` +
        `<span>© ${new Date().getFullYear()} HADIRA</span>` +
        `</div>` +
        `</section>` +
        `<section class="login-main">` +
        `<form id="login-form" class="login-form">` +
        `<span class="eyebrow" style="color:var(--teal-700)">WORK BETTER, TOGETHER</span>` +
        `<h1>Selamat datang kembali<span style="color:var(--orange-500)">.</span>` +
        `</h1>` +
        `<p class="muted">Masuk untuk memulai hari produktifmu.</p>` +
        `<div class="role-switch" aria-label="Pilih peran">` +
        `<button type="button" data-role="employee" class="${role==='employee'?'selected':''}" aria-pressed="${role==='employee'}">${icon('profile')} Karyawan</button>` +
        `<button type="button" data-role="admin" class="${role==='admin'?'selected':''}" aria-pressed="${role==='admin'}">${icon('users')} Admin</button>` +
        `</div>` +
        `<label class="field">Email<input name="email" type="email" autocomplete="username" required value="${role==='admin'?'admin':'ayu'}@hadira.id" placeholder="nama@perusahaan.com">` +
        `</label>` +
        `<label class="field">Kata sandi<span class="password-wrap">` +
        `<input name="password" id="password" type="password" autocomplete="current-password" required value="Hadira123">` +
        `<button class="icon-btn" type="button" id="show-password" aria-label="Tampilkan kata sandi">${icon('eye')}</button>` +
        `</span>` +
        `</label>` +
        `<div class="between">` +
        `<label class="check">` +
        `<input type="checkbox" name="remember"> Ingat email saya</label>` +
        `<button type="button" class="icon-btn" id="forgot" aria-label="Bantuan login">${icon('help')}</button>` +
        `</div>` +
        `<div id="login-error" class="error" role="alert">` +
        `</div>` +
        `<button class="btn primary" type="submit">Masuk ke HADIRA ${icon('arrow')}</button>` +
        `<p class="caption" style="text-align:center">Kehadiran tercatat, produktivitas meningkat.</p>` +
        `<div class="demo-note">` +
        `<strong>Akun demo siap dicoba</strong>` +
        `<br>Karyawan: ayu@hadira.id · Admin: admin@hadira.id<br>Kata sandi: <strong>Hadira123</strong>` +
        `<br>Prototipe frontend · data tersimpan di browser ini.</div>` +
        `</form>` +
        `</section>` +
        `</main>`;
    let remembered = localStorage.getItem('hadira-email-' + role);
    if (remembered) {
        $('#login-form').elements.email.value = remembered;
        $('#login-form').elements.remember.checked = true
    }
    document.querySelectorAll('button[data-role]').forEach(b => b.onclick = () => {
        role = b.dataset.role;
        login()
    });
    $('#show-password').onclick = () => {
        let p = $('#password');
        p.type = p.type === 'password' ? 'text' : 'password';
        $('#show-password').setAttribute('aria-label', p.type === 'password' ?
            'Tampilkan kata sandi' : 'Sembunyikan kata sandi')
    };
    $('#forgot').onclick = () => toast(
        'Untuk demo, gunakan kata sandi Hadira123. Untuk akun kantor, hubungi HR.');
    $('#login-form').onsubmit = e => {
        e.preventDefault();
        let f = e.target.elements;
        let employee = db.employees.find(x => x.email.toLowerCase() === f.email.value.trim()
            .toLowerCase() && x.status === 'Aktif');
        if (f.password.value !== 'Hadira123' || (role === 'admin' ? f.email.value.trim()
                .toLowerCase() !== 'admin@hadira.id' : !employee)) {
            $('#login-error').textContent =
                'Email atau kata sandi tidak sesuai, atau akun tidak aktif.';
            return
        }
        session = {
            role,
            employeeId: role === 'admin' ? null : employee.id
        };
        sessionStorage.setItem('hadira-session', JSON.stringify(session));
        if (f.remember.checked) localStorage.setItem('hadira-email-' + role, f.email.value
        .trim());
        else localStorage.removeItem('hadira-email-' + role);
        navigate('home')
    };
}
