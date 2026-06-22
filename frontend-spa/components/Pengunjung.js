const Pengunjung = {
    template: `
        <div class="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
            <nav class="bg-white shadow-sm px-8 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
                <div class="text-2xl font-black text-rose-700 tracking-tight flex items-center gap-2">
                    <span class="text-3xl">📚</span> Rent<span class="text-gray-800">Book.</span>
                    <span class="ml-3 bg-rose-100 text-rose-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">Katalog Publik</span>
                </div>
                <router-link to="/login" class="bg-rose-50 text-rose-600 border border-rose-200 px-5 py-2 rounded-lg font-bold shadow-sm hover:bg-rose-600 hover:text-white transition text-sm">
                    Akses Admin
                </router-link>
            </nav>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div class="text-center mb-10">
                    <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Jelajahi Koleksi Kami</h1>
                    <p class="text-gray-500 font-medium max-w-2xl mx-auto text-lg">Cari buku favoritmu dan pastikan ketersediaannya sebelum datang ke perpustakaan.</p>
                </div>

                <div class="max-w-2xl mx-auto mb-12">
                    <div class="relative shadow-sm rounded-2xl">
                        <input v-model="searchQuery" type="text" placeholder="🔍 Cari judul buku atau nama penulis..." 
                            class="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition text-gray-700 font-medium text-lg">
                    </div>
                </div>

                <div v-if="filteredBuku.length === 0" class="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-200">
                    <div class="text-6xl mb-4">📭</div>
                    <p class="text-gray-500 font-bold text-xl">Waduh, buku yang dicari belum ketemu.</p>
                    <p class="text-gray-400 mt-2">Coba gunakan kata kunci lain.</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <div v-for="buku in filteredBuku" :key="buku.id" class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group transform hover:-translate-y-1">
                        
                        <div class="bg-gray-100 h-72 flex items-center justify-center overflow-hidden border-b border-gray-100 relative">
                            <img v-if="buku.cover" :src="'http://localhost:8080/uploads/' + buku.cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Cover">
                            <div v-else class="text-gray-300 font-black text-lg tracking-widest uppercase">No Cover</div>

                            <span class="absolute top-3 left-3 bg-white/95 backdrop-blur text-rose-600 border border-rose-100 text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded shadow-sm">
                                {{ buku.nama_kategori || 'Umum' }}
                            </span>
                        </div>

                        <div class="p-6 flex-grow flex flex-col justify-between">
                            <div class="mb-5">
                                <h3 class="font-black text-gray-900 text-lg leading-snug mb-1.5 line-clamp-2">{{ buku.judul }}</h3>
                                <p class="text-gray-500 text-xs font-semibold">Oleh: <span class="text-gray-700">{{ buku.penulis || '-' }}</span></p>
                                <p v-if="buku.penerbit" class="text-gray-400 text-[10px] mt-1.5 uppercase tracking-wider font-bold">Terbitan: {{ buku.penerbit }}</p>
                            </div>

                            <div class="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ketersediaan</span>
                                <span :class="buku.status_ketersediaan === 'tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" 
                                    class="px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {{ buku.status_ketersediaan || 'Tersedia' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <footer class="bg-white py-6 text-center text-gray-400 text-sm font-medium border-t border-gray-200 relative z-10 mt-12">
                &copy; {{ new Date().getFullYear() }} RentBook - Publik Katalog.
            </footer>
        </div>
    `,
    data() {
        return {
            bukuList: [],
            searchQuery: ''
        }
    },
    computed: {
        filteredBuku() {
            return this.bukuList.filter(buku => {
                const query = this.searchQuery.toLowerCase();
                const judulMatch = buku.judul ? buku.judul.toLowerCase().includes(query) : false;
                const penulisMatch = buku.penulis ? buku.penulis.toLowerCase().includes(query) : false;
                return judulMatch || penulisMatch;
            });
        }
    },
    mounted() {
        this.getKoleksiBuku();
    },
    methods: {
        async getKoleksiBuku() {
            try {
                // Tembak URL API buku punya Razy
                const res = await axios.get('http://localhost:8080/api/buku');
                this.bukuList = res.data;
            } catch (e) {
                console.error("Gagal memuat katalog:", e);
            }
        }
    }
};