/**
 * HADIRA — Utilitas bersama: DOM, escaping teks, tanggal WIB, pengurutan, dan ekspor CSV.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// $
const $ = s => document.querySelector(s);

// esc
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} [c]));

// today
const today = () => new Date().toLocaleDateString('sv-SE', {
    timeZone: 'Asia/Jakarta'
});

// time
const time = () => new Date().toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false
}).replaceAll('.', ':');

// dateText
const dateText = d => new Date(d + 'T12:00:00').toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
});

// fullDate
const fullDate = () => new Date().toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

// initials
const initials = n => n.split(' ').slice(0, 2).map(x => x[0]).join('');

// sortRows
const sortRows = (a, b) => b.date.localeCompare(a.date) || a.employeeId.localeCompare(b.employeeId);

// csv
function csv(filename, headers, rows) {
    let safe = v => {
        let s = String(v ?? '');
        if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
        return '"' + s.replaceAll('"', '""') + '"'
    };
    let body = '\uFEFF' + [headers, ...rows].map(r => r.map(safe).join(',')).join('\r\n');
    let url = URL.createObjectURL(new Blob([body], {
        type: 'text/csv;charset=utf-8;'
    }));
    let a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Laporan CSV berhasil diunduh.')
}
