/**
 * HADIRA — Notifikasi dan modal bersama.
 * Script klasik bersama; urutan pemuatan dicatat pada setiap HTML.
 */

// toast
function toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3500)
}

// openModal
function openModal(html) {
    $('#modal').innerHTML = html;
    $('#modal').showModal();
    $('#modal').querySelectorAll('[data-close]').forEach(b => b.onclick = () => $('#modal').close())
}
