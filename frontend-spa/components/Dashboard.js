const Dashboard = {
    template: `
    <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
        <!-- Top Navigation Bar -->
        <nav class="bg-rose-700 text-white shadow-md sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">📚</span>
                        <span class="font-black text-xl tracking-tight hidden sm:block">RentBook</span>
                    </div>
                    
                    <div class="hidden md:block flex-1">
                        <div class="ml-10 flex items-baseline space-x-2">
                            <router-link to="/dashboard" exact-active-class="bg-rose-900 text-white" class="text-rose-100 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors">Beranda</router-link>
                            <router-link to="/dashboard/buku" active-class="bg-rose-900 text-white" class="text-rose-100 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors">Katalog Buku</router-link>
                            <router-link to="/dashboard/kategori" active-class="bg-rose-900 text-white" class="text-rose-100 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors">Kategori</router-link>
                            <router-link to="/dashboard/peminjaman" active-class="bg-rose-900 text-white" class="text-rose-100 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors">Sirkulasi Pinjam</router-link>
                            <router-link to="/dashboard/pengembalian" active-class="bg-rose-900 text-white" class="text-rose-100 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-md text-sm font-semibold transition-colors">Pengembalian</router-link>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div class="hidden md:block text-right">
                            <div class="text-sm font-bold text-white leading-tight">Razy Al Farisi</div>
                            <div class="text-[10px] text-rose-200 uppercase tracking-widest font-bold">Admin Panel</div>
                        </div>
                        <button @click="logout" class="bg-rose-800 hover:bg-red-600 text-white font-bold p-2 px-3 rounded-md transition-colors text-sm shadow-inner" title="Logout">
                            Keluar ⏏
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <header class="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
                    <p class="text-gray-500 text-sm mt-1 font-medium">Panel kontrol manajemen perpustakaan.</p>
                </div>
                <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
                    📅 {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
                </div>
            </header>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
                <router-view></router-view>
            </div>
        </main>
    </div>
    `,
    methods: {
        logout() {
            if(confirm('Yakin mau keluar dari sistem?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('isLoggedIn');
                window.location.hash = '#/login';
            }
        }
    }
};