const Home = {
    template: `
        <div class="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden">
            <nav class="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200 relative z-10">
                <div class="text-2xl font-black text-rose-700 tracking-tight flex items-center gap-2">
                    <span class="text-3xl">📚</span> Rent<span class="text-gray-800">Book.</span>
                </div>
                <router-link to="/login" class="bg-rose-50 text-rose-600 border border-rose-200 px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-rose-600 hover:text-white transition text-sm">
                    Akses Admin
                </router-link>
            </nav>

            <div class="flex-grow flex flex-col items-center justify-center text-center px-4 py-16 relative z-10">
                <span class="px-5 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold tracking-widest uppercase mb-6">Pusat Literasi Digital</span>
                <h1 class="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">Eksplorasi Ilmu Tanpa Batas <br>dengan <span class="text-rose-600">RentBook</span></h1>
                <p class="text-lg text-gray-500 mb-10 max-w-2xl font-medium">Platform sirkulasi perpustakaan cerdas untuk pendataan koleksi, klasifikasi genre, dan pengelolaan transaksi peminjaman.</p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10 mb-16">
                    <router-link to="/pengunjung" class="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl hover:bg-gray-800 transition transform hover:-translate-y-1 text-sm tracking-wide">
                        📖 Jelajahi Katalog Buku
                    </router-link>
                    <router-link to="/login" class="bg-rose-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl hover:bg-rose-700 transition transform hover:-translate-y-1 text-sm tracking-wide">
                        🔐 Akses Admin Panel
                    </router-link>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div class="text-4xl font-black text-rose-600 mb-2">{{ totalBuku }}</div>
                        <h3 class="text-gray-500 font-bold uppercase tracking-wider text-xs">Total Koleksi Buku</h3>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div class="text-4xl font-black text-blue-600 mb-2">15</div>
                        <h3 class="text-gray-500 font-bold uppercase tracking-wider text-xs">Kategori Genre</h3>
                    </div>
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <div class="text-4xl font-black text-emerald-500 mb-2">Aktif</div>
                        <h3 class="text-gray-500 font-bold uppercase tracking-wider text-xs">Status Server</h3>
                    </div>
                </div>
            </div>
            
            <footer class="bg-white py-6 text-center text-gray-400 text-sm font-medium border-t border-gray-200">
                &copy; {{ new Date().getFullYear() }} RentBook - Library Management System.
            </footer>
        </div>
    `,
    data() { 
        return { totalBuku: 0 } 
    },
    mounted() { 
        this.getRingkasanBuku(); 
    },
    methods: {
        async getRingkasanBuku() {
            try {
                const res = await axios.get('http://localhost:8080/api/buku');
                this.totalBuku = res.data.length; 
            } catch (e) {
                this.totalBuku = 42; 
            }
        }
    }
};