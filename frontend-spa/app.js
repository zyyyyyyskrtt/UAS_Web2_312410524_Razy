// 1. OTOMATISASI TOKEN (Axios Request Interceptor)
// Menyuntikkan token dari localStorage secara otomatis ke header HTTP
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. TANGKAP ERROR 401 GLOBAL (Axios Response Interceptor)
// Kalau token expired atau nyoba nakal masuk tanpa token, langsung tendang ke Login
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        alert('Sesi Anda telah habis atau Anda tidak memiliki akses. Silakan login kembali.');
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.location.hash = '#/login'; // Redirect paksa ke halaman login
    }
    return Promise.reject(error);
});

// 3. DAFTARKAN RUTE (Routing Vue)
// Menghubungkan URL dengan file komponen yang ada di folder components/
const routes = [
    // Asumsi lu punya file Home.js. Kalau nggak punya, ganti aja jadi redirect: '/login'
    { path: '/', component: Home }, 
    { path: '/login', component: Login },
    { path: '/pengunjung', component: Pengunjung },
    
    { 
        path: '/dashboard', 
        component: Dashboard,
        meta: { requiresAuth: true }, // Syarat: Wajib Login untuk buka halaman ini!
        // INI KODE FINAL: Anak-anak dari Dashboard ditaruh di sini
        children: [
            // Default: Saat klik "Beranda Utama" (URL: /dashboard)
            { path: '', component: { template: '<div class="text-gray-500"><h2 class="text-3xl font-bold text-gray-800 mb-4">Selamat Datang di Admin Panel</h2><p>Pilih menu di sebelah kiri untuk mulai mengelola perpustakaan.</p></div>' } },
            
            // Saat klik "Data Komik" (URL: /dashboard/komik)
            { path: 'buku', component: DataBuku },
            
            { path: 'kategori', component: Kategori },

            { path: 'peminjaman', component: Peminjaman },

            { path: 'pengembalian', component: Pengembalian }
        ]
    }
];

// 4. BUAT INSTANCE ROUTER
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

// 5. CLIENT-SIDE SECURITY (Navigation Guards)
// Mencegat perpindahan rute URL di browser
router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    
    // Kalau mau ke halaman berproteksi (Dashboard) tapi belum login
    if (to.meta.requiresAuth && !loggedIn) {
        next('/login');
    } 
    // Kalau udah login tapi iseng buka halaman /login lagi
    else if (to.path === '/login' && loggedIn) {
        next('/dashboard');
    } 
    // Kalau aman dan memenuhi syarat, silakan lewat
    else {
        next();
    }
});

// 6. JALANKAN APLIKASI VUE
const app = Vue.createApp({});
app.use(router);
app.mount('#app');