/**
 * HADIRA — Ikon SVG yang dipakai semua halaman.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// paths
const paths = {
    home: 'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
    users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
    history: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2',
    profile: 'M20 21v-2a7 7 0 0 0-14 0v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    logout: 'M9 21H4V3h5 M14 8l5 4-5 4 M8 12h11',
    clock: 'M12 8v4l3 2 M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0',
    calendar: 'M8 2v4 M16 2v4 M3 10h18 M4 4h16a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1 M8 15l2 2 5-4',
    file: 'M14 2H4v20h16V8z M14 2v6h6 M8 13h8 M8 17h5',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
    arrow: 'M5 12h14 M14 7l5 5-5 5',
    download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
    plus: 'M12 5v14 M5 12h14',
    edit: 'M16 3l5 5-12 12-6 1 1-6z M14 5l5 5',
    trash: 'M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7',
    eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 0-6 0 3 3 0 0 0 6 0',
    help: 'M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17v.1 M21 12a9 9 0 1 0-18 0 9 9 0 0 0 18 0',
    check: 'M5 12l4 4L19 6',
    close: 'M6 6l12 12 M6 18L18 6',
    search: 'M21 21l-6-6 M17 10a7 7 0 1 0-14 0 7 7 0 0 0 14 0'
};

// icon
function icon(n) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
        `<path d="${paths[n]||paths.file}"/>` +
        `</svg>`
}
