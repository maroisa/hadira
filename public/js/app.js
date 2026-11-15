/** Entry point: pilih renderer halaman berdasarkan data-page pada HTML. */
function renderPage(me) {
    const role = document.body.dataset.role;
    if (page === 'home') return role === 'admin' ? adminHome() : employeeHome(me);
    if (page === 'employees') return employeesPage();
    if (page === 'history') return historyPage();
    return profilePage(me);
}

if (page === 'login') {
    if (session) navigate('home');
    else login();
} else {
    render();
    setInterval(updateClock, 1000);
}
window.addEventListener('offline', () => {
    toast('Kamu sedang offline. Perubahan demo tetap tersimpan di browser.');
});
