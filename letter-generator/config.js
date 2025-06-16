// Configuration globale
const CONFIG = {
    API_URL: 'https://votre-api.com', // À remplacer par votre URL d'API
    STORAGE_KEY: 'motivai_user_data',
    ROUTES: {
        HOME: 'index.html',
        LOGIN: 'login.html',
        DASHBOARD: 'dashboard.html',
        PROFILE: 'profile.html',
        FORM: 'form.html',
        RESULT: 'result.html',
        JOBS: 'jobs.html',
        COMPANIES: 'companies.html',
        CV_BUILDER: 'cv-builder.html',
        ADMIN: 'admin-dashboard.html'
    }
};

// Gestion de l'authentification
class Auth {
    static isAuthenticated() {
        return localStorage.getItem(CONFIG.STORAGE_KEY) !== null;
    }

    static getUser() {
        const userData = localStorage.getItem(CONFIG.STORAGE_KEY);
        return userData ? JSON.parse(userData) : null;
    }

    static setUser(userData) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(userData));
    }

    static logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        window.location.href = CONFIG.ROUTES.LOGIN;
    }
}

// Gestion de la navigation
class Navigation {
    static redirectTo(route) {
        if (CONFIG.ROUTES[route]) {
            window.location.href = CONFIG.ROUTES[route];
        }
    }

    static checkAuth() {
        const publicPages = ['HOME', 'LOGIN'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (!Auth.isAuthenticated() && !publicPages.includes(currentPage)) {
            window.location.href = CONFIG.ROUTES.LOGIN;
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    Navigation.checkAuth();
    
    // Gestion des liens de navigation
    document.querySelectorAll('a[data-route]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const route = e.target.dataset.route;
            Navigation.redirectTo(route);
        });
    });

    // Gestion du bouton de déconnexion
    const logoutBtn = document.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            Auth.logout();
        });
    }
}); 