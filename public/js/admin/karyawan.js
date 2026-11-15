/**
 * HADIRA — CRUD karyawan: daftar, tambah, detail, edit dan hapus.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// employeeList
function employeeList() {
    return db.employees.filter(e => (e.name + ' ' + e.email + ' ' + e.id).toLowerCase().includes(
        filters.q.toLowerCase()) && (!filters.department || e.department === filters
        .department) && (!filters.status || e.status === filters.status))
}

// employeesPage
function employeesPage() {
    let rows = employeeList(),
        start = (pageNo - 1) * 6;
    return heading('Kelola karyawan', 'Kelola data dan akses seluruh karyawan di satu tempat.') +
        `<div class="stats admin-stats">${stat('Total karyawan',db.employees.length,'orang','users')}${stat('Karyawan aktif',db.employees.filter(e=>e.status==='Aktif').length,'orang','profile','#2E9E6B')}${stat('Karyawan nonaktif',db.employees.filter(e=>e.status==='Nonaktif').length,'orang','profile','#8A97A1')}</div>` +
        `<section class="card">` +
        `<div class="table-header between">` +
        `<div>` +
        `<h2>Daftar karyawan</h2>` +
        `<p>Tim hebat, dimulai dari orang-orang hebat.</p>` +
        `</div>` +
        `<div style="display:flex;gap:8px">` +
        `<button class="btn outline" data-action="export-employees">${icon('download')}<span>Ekspor</span>` +
        `</button>` +
        `<button class="btn primary" data-action="add-employee">${icon('plus')} Tambah karyawan</button>` +
        `</div>` +
        `</div>` +
        `<div class="filters">` +
        `<input id="search" aria-label="Cari karyawan" placeholder="Cari nama, email, atau ID karyawan…" value="${esc(filters.q)}">` +
        `<select id="department-filter" aria-label="Filter departemen">` +
        `<option value="">Semua departemen</option>${[...new Set(db.employees.map(x=>x.department))].map(x=>`<option ${filters.department===x?'selected':''}>${esc(x)}</option>`).join('')}</select>` +
        `<select id="status-filter" aria-label="Filter status">` +
        `<option value="">Semua status</option>${['Aktif','Nonaktif'].map(s=>`<option ${filters.status===s?'selected':''}>${s}</option>`).join('')}</select>` +
        `</div>` +
        `<div class="table-scroll">` +
        `<table>` +
        `<thead>` +
        `<tr>` +
        `<th>Karyawan</th>` +
        `<th>Departemen</th>` +
        `<th>Jabatan</th>` +
        `<th>Status</th>` +
        `<th>Aksi</th>` +
        `</tr>` +
        `</thead>` +
        `<tbody>${rows.slice(start,start+6).map((e,i)=>`<tr><td><div class="person"><span class="avatar ${i%2?'blue':''}">${esc(initials(e.name))}</span><div><strong>${esc(e.name)}</strong><small>${esc(e.email)}</small></div></div></td><td>${esc(e.department)}</td><td>${esc(e.position)}</td><td>${badge(e.status)}</td><td><button class="icon-btn" data-view="${esc(e.id)}" aria-label="Detail ${esc(e.name)}">${icon('eye')}</button><button class="icon-btn" data-edit="${esc(e.id)}" aria-label="Edit ${esc(e.name)}">${icon('edit')}</button><button class="icon-btn" data-delete="${esc(e.id)}" aria-label="Hapus ${esc(e.name)}">${icon('trash')}</button></td></tr>`).join('')}</tbody>` +
        `</table>` +
        `</div>${!rows.length?empty('Tidak ada karyawan ditemukan','Coba ubah kata pencarian atau filter.'):''}${pagination(rows.length,start)}</section>`
}

// employeeForm
function employeeForm(id) {
    let e = db.employees.find(x => x.id === id);
    openModal(`<div class="between">` +
        `<h2>${e?'Edit':'Tambah'} karyawan</h2>` +
        `<button class="icon-btn" data-close aria-label="Tutup">${icon('close')}</button>` +
        `</div>` +
        `<p>${e?'Perbarui informasi anggota tim.':'Sambut anggota baru di tim HADIRA.'}</p>` +
        `<form id="employee-form">` +
        `<label class="field">Nama lengkap<input name="name" required maxlength="70" value="${esc(e?.name||'')}" placeholder="Contoh: Ayu Lestari">` +
        `</label>` +
        `<label class="field">Email kantor<input name="email" type="email" required maxlength="100" value="${esc(e?.email||'')}" placeholder="nama@hadira.id">` +
        `</label>` +
        `<label class="field">Departemen<input name="department" list="departments" required maxlength="60" value="${esc(e?.department||'')}" placeholder="Pilih atau ketik departemen">` +
        `<datalist id="departments">${[...new Set(db.employees.map(x=>x.department))].map(x=>`<option value="${esc(x)}">`).join('')}</datalist>` +
        `</label>` +
        `<label class="field">Jabatan<input name="position" required maxlength="70" value="${esc(e?.position||'')}" placeholder="Contoh: UI/UX Designer">` +
        `</label>` +
        `<label class="field">Status<select name="status">` +
        `<option ${e?.status==='Aktif'?'selected':''}>Aktif</option>` +
        `<option ${e?.status==='Nonaktif'?'selected':''}>Nonaktif</option>` +
        `</select>` +
        `</label>` +
        `<div class="error" id="form-error" role="alert">` +
        `</div>` +
        `<div class="actions">` +
        `<button class="btn outline" type="button" data-close>Batal</button>` +
        `<button class="btn primary" type="submit">Simpan karyawan</button>` +
        `</div>` +
        `</form>`);
    $('#employee-form').onsubmit = ev => {
        ev.preventDefault();
        let data = Object.fromEntries(new FormData(ev.target));
        for (let k in data) data[k] = data[k].trim();
        if (Object.values(data).some(v => !v)) {
            $('#form-error').textContent = 'Semua kolom wajib diisi.';
            return
        }
        if (db.employees.some(x => x.id !== id && x.email.toLowerCase() === data.email
                .toLowerCase()) || data.email.toLowerCase() === 'admin@hadira.id') {
            $('#form-error').textContent = 'Email sudah digunakan. Gunakan email lain.';
            return
        }
        if (e) Object.assign(e, data);
        else db.employees.push({
            id: 'EMP' + Date.now(),
            ...data
        });
        activity(`${e?'Memperbarui':'Menambahkan'} karyawan ${data.name}`);
        $('#modal').close();
        render();
        toast('Data karyawan berhasil disimpan.')
    };
}

// viewEmployee
function viewEmployee(id) {
    let e = db.employees.find(x => x.id === id);
    if (!e) return;
    openModal(`<div class="between">` +
        `<h2>Detail karyawan</h2>` +
        `<button class="icon-btn" data-close aria-label="Tutup">${icon('close')}</button>` +
        `</div>` +
        `<p>${esc(e.id)}</p>` +
        `<div class="person" style="margin-bottom:24px">` +
        `<span class="avatar">${esc(initials(e.name))}</span>` +
        `<div>` +
        `<h3>${esc(e.name)}</h3>` +
        `<small>${esc(e.email)}</small>` +
        `</div>` +
        `</div>` +
        `<div class="profile-grid">${[['Departemen',e.department],['Jabatan',e.position],['Status',e.status],['Catatan kehadiran',db.history.filter(r=>r.employeeId===id).length+' catatan']].map(([k,v])=>`<div><small>${k}</small><p>${esc(v)}</p></div>`).join('')}</div>` +
        `<div class="actions">` +
        `<button class="btn" id="view-history">${icon('history')} Buka riwayat</button>` +
        `</div>`);
    $('#view-history').onclick = () => {
        $('#modal').close();
        location.href = pageUrl('history', '?employee=' + encodeURIComponent(id))
    };
}

// deleteEmployee
function deleteEmployee(id) {
    let e = db.employees.find(x => x.id === id);
    if (!e) return;
    openModal(`<h2>Hapus karyawan?</h2>` +
        `<p>` +
        `<strong>${esc(e.name)}</strong> akan dihapus dari daftar. Seluruh riwayat absensinya juga akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>` +
        `<div class="actions">` +
        `<button class="btn outline" data-close>Batal</button>` +
        `<button class="btn danger" id="confirm-delete">${icon('trash')} Ya, hapus</button>` +
        `</div>`);
    $('#confirm-delete').onclick = () => {
        db.employees = db.employees.filter(x => x.id !== id);
        db.history = db.history.filter(x => x.employeeId !== id);
        activity(`Menghapus karyawan ${e.name}`);
        $('#modal').close();
        pageNo = 1;
        render();
        toast('Karyawan dan riwayatnya berhasil dihapus.')
    };
}
