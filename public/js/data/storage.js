/**
 * HADIRA — Penyimpanan browser dan state halaman. Titik integrasi database/API nanti.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// db
let db;
try {
    db = JSON.parse(localStorage.getItem('hadira-data-v1'))
} catch {}
if (!db) db = {
    employees: seeds,
    history: seedHistory(),
    activities: []
};

// session
let session;
try {
    session = JSON.parse(sessionStorage.getItem('hadira-session'))
} catch {}

// role
let role = 'employee';
let page = document.body.dataset.page || 'login';
let pageNo = 1;
let filters = {
    q: '',
    department: '',
    status: '',
    month: '',
    employee: new URLSearchParams(location.search).get('employee') || ''
};

// save
function save() {
    localStorage.setItem('hadira-data-v1', JSON.stringify(db))
}

// activity
function activity(message) {
    db.activities.unshift({
        message,
        at: new Date().toLocaleString('id-ID')
    });
    db.activities = db.activities.slice(0, 30);
    save()
}

// myRows
function myRows() {
    return db.history.filter(r => r.employeeId === session.employeeId)
}
