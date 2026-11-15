/**
 * HADIRA — Data contoh awal. Bukan data dari server.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// seeds
const seeds = [
    ['EMP001', 'Ayu Lestari', 'ayu@hadira.id', 'Product & Design', 'UI/UX Designer', 'Aktif'],
    ['EMP002', 'Budi Santoso', 'budi@hadira.id', 'Teknologi', 'Frontend Developer', 'Aktif'],
    ['EMP003', 'Citra Amalia', 'citra@hadira.id', 'Human Resources', 'HR Specialist', 'Aktif'],
    ['EMP004', 'Dimas Pratama', 'dimas@hadira.id', 'Pemasaran', 'Content Strategist', 'Aktif'],
    ['EMP005', 'Nadia Putri', 'nadia@hadira.id', 'Keuangan', 'Finance Officer', 'Nonaktif'],
    ['EMP006', 'Rizky Ramadhan', 'rizky@hadira.id', 'Teknologi', 'Backend Developer', 'Aktif'],
    ['EMP007', 'Salsa Nabila', 'salsa@hadira.id', 'Product & Design', 'Product Designer',
        'Aktif'
    ],
    ['EMP008', 'Fajar Nugraha', 'fajar@hadira.id', 'Pemasaran', 'Marketing Executive', 'Aktif']
].map(([id, name, email, department, position, status]) => ({
    id,
    name,
    email,
    department,
    position,
    status
}));

// seedHistory
function seedHistory() {
    let a = [];
    for (let day = 1; day <= 22; day++) {
        let d = new Date();
        d.setDate(d.getDate() - day);
        if ([0, 6].includes(d.getDay())) continue;
        let key = d.toLocaleDateString('sv-SE');
        seeds.forEach((e, i) => {
            let status = (day + i) % 13 === 0 ? 'Izin' : (day + i) % 11 === 0 ? 'Sakit' : (
                day + i) % 7 === 0 ? 'Terlambat' : 'Hadir';
            a.push({
                id: `${key}-${e.id}`,
                employeeId: e.id,
                date: key,
                in: status === 'Hadir' ? '07:5' + (i % 9) : status === 'Terlambat' ?
                    '08:1' + (i % 9) : '—',
                out: ['Hadir', 'Terlambat'].includes(status) ? '17:0' + (i % 9) :
                    '—',
                status,
                note: status === 'Izin' ? 'Keperluan keluarga' : status ===
                    'Sakit' ? 'Pemulihan kesehatan' : 'Kantor pusat'
            });
        });
    }
    return a;
}
