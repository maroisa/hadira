/** URL halaman HADIRA yang disediakan oleh view Blade. */
const hadiraRoutes = JSON.parse(document.body.dataset.routes);

function pageUrl(target, extra = '') {
    const role = session?.role === 'admin' ? 'admin' : 'employee';
    return hadiraRoutes[role + '.' + target] + extra;
}

function navigate(target) {
    location.href = pageUrl(target);
}

function logout() {
    sessionStorage.removeItem('hadira-session');
    location.href = hadiraRoutes.login;
}
