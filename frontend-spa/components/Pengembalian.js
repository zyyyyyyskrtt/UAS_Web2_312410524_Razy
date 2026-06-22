const Pengembalian = {
    template: `
        <div class="w-full">
            <div class="mb-6">
                <h1 class="text-2xl font-black text-gray-800">Proses Pengembalian</h1>
                <p class="text-gray-500 text-sm mt-1">Daftar buku yang menunggu dikembalikan.</p>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
                <table class="min-w-full text-left">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID Trx</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Peminjam</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Judul Buku</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Aksi Verifikasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="activeList.length === 0">
                            <td colspan="4" class="px-6 py-10 text-center text-gray-500 font-medium">Tidak ada buku yang berstatus dipinjam.</td>
                        </tr>
                        <tr v-for="trx in activeList" :key="trx.id" class="border-b border-gray-100 hover:bg-rose-50/30">
                            <td class="px-6 py-4 text-sm font-bold text-gray-700">#{{ String(trx.id).padStart(4, '0') }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-600">UID: {{ trx.id_user }}</td>
                            <td class="px-6 py-4 text-sm font-bold text-blue-700">{{ trx.judul_buku || trx.judul_komik || 'Buku #' + trx.id_buku }}</td>
                            <td class="px-6 py-4 text-sm">
                                <button @click="kembalikan(trx.id)" class="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded font-bold text-xs transition-colors">
                                    Konfirmasi Kembali
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() { return { peminjamanList: [] } },
    computed: {
        activeList() { return this.peminjamanList.filter(trx => trx.status_pinjam === 'berjalan' || trx.status === 'dipinjam' || trx.status_pinjam === 'dipinjam'); }
    },
    mounted() { this.getPeminjaman(); },
    methods: {
        async getPeminjaman() {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
            const res = await axios.get('http://localhost:8080/api/peminjaman', config);
            this.peminjamanList = res.data;
        },
        async kembalikan(id) {
            if(confirm('Verifikasi pengembalian buku ini?')) {
                const token = localStorage.getItem('token');
                const config = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
                await axios.put('http://localhost:8080/api/peminjaman/' + id, {}, config);
                alert('Terkonfirmasi! Buku sudah dikembalikan.');
                this.getPeminjaman();
            }
        }
    }
};