/**
 * HADIRA — Aksi absen masuk/pulang dan pengajuan izin atau sakit.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// attendance
function attendance() {
    let r = myRows().find(x => x.date === today()),
        me = db.employees.find(e => e.id === session.employeeId);
    if (r && (!['Hadir', 'Terlambat'].includes(r.status) || r.out !== '—')) return;
    let current = time().slice(0, 5);
    if (!r) {
        r = {
            id: today() + '-' + me.id,
            employeeId: me.id,
            date: today(),
            in: current,
            out: '—',
            status: current > '08:00' ? 'Terlambat' : 'Hadir',
            note: 'Kantor pusat'
        };
        db.history.unshift(r);
        activity(`${me.name} melakukan absen masuk`)
    } else {
        r.out = current;
        activity(`${me.name} melakukan absen pulang`)
    }
    render();
    toast('✓ ' + (r.out === '—' ? 'Absen masuk' : 'Absen pulang') + ' berhasil dicatat pukul ' +
        current + ' WIB.');
}

// requestLeave
function requestLeave() {
    openModal(`<h2>Ajukan izin atau sakit</h2>` +
        `<p>Berikan informasi ketidakhadiranmu dengan lengkap.</p>` +
        `<div class="notice">Dalam demo ini, pengajuan langsung tercatat di riwayat tanpa persetujuan HR.</div>` +
        `<form id="leave-form">` +
        `<label class="field">Tanggal<input type="date" name="date" required value="${today()}">` +
        `</label>` +
        `<label class="field">Jenis pengajuan<select name="status">` +
        `<option>Izin</option>` +
        `<option>Sakit</option>` +
        `</select>` +
        `</label>` +
        `<label class="field">Keterangan<input name="note" required maxlength="150" placeholder="Tuliskan alasan pengajuan">` +
        `</label>` +
        `<div id="form-error" class="error" role="alert">` +
        `</div>` +
        `<div class="actions">` +
        `<button class="btn outline" type="button" data-close>Batal</button>` +
        `<button class="btn primary" type="submit">Simpan pengajuan</button>` +
        `</div>` +
        `</form>`);
    $('#leave-form').onsubmit = e => {
        e.preventDefault();
        let d = Object.fromEntries(new FormData(e.target));
        if (!d.note.trim()) {
            $('#form-error').textContent = 'Keterangan wajib diisi.';
            return
        }
        if (myRows().some(r => r.date === d.date)) {
            $('#form-error').textContent = 'Sudah ada catatan absensi pada tanggal tersebut.';
            return
        }
        db.history.unshift({
            id: d.date + '-' + session.employeeId,
            employeeId: session.employeeId,
            date: d.date,
            status: d.status,
            note: d.note.trim(),
            in: '—',
            out: '—'
        });
        activity(`Pengajuan ${d.status.toLowerCase()} oleh ${db.employees.find(x=>x.id===session.employeeId).name}`);
        $('#modal').close();
        render();
        toast('Pengajuan berhasil dicatat di riwayat.')
    };
}
