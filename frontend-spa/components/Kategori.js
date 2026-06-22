const Kategori = {
    template: `
        <div class="w-full">
            <div class="mb-6">
                <h1 class="text-2xl font-black text-gray-800">Master Kategori</h1>
                <p class="text-gray-500 text-sm mt-1">Daftar klasifikasi genre.</p>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-2/3 shadow-sm">
                <table class="min-w-full text-left">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-32">ID Genre</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Nama Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="kategoriList.length === 0">
                            <td colspan="2" class="px-6 py-8 text-center text-gray-500 font-medium">Memuat data...</td>
                        </tr>
                        <tr v-for="kategori in kategoriList" :key="kategori.id" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="px-6 py-4 text-sm font-bold text-gray-500">{{ String(kategori.id).padStart(3, '0') }}</td>
                            <td class="px-6 py-4 text-sm font-bold text-gray-800">{{ kategori.nama_kategori || kategori.nama_genre }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            kategoriList: []
        }
    },
    mounted() { 
        this.getKategori(); 
    },
    methods: {
        async getKategori() {
            try {
                const res = await axios.get('http://localhost:8080/api/kategori');
                this.kategoriList = res.data;
            } catch (e) { 
                this.kategoriList = [
                    { id: 1, nama_genre: 'Romance' },
                    { id: 2, nama_genre: 'Adventure' },
                    { id: 3, nama_genre: 'Drama' },
                    { id: 4, nama_genre: 'Comedy' },
                    { id: 6, nama_genre: 'Action' },
                    { id: 7, nama_genre: 'Fantasy' }
                ];
            }
        }
    }
};