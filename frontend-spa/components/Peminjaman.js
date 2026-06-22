const Peminjaman = {
    template: `
        <div class="w-full">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-black text-gray-800">Sirkulasi Peminjaman</h1>
                    <p class="text-gray-500 text-sm mt-1">Pencatatan aktivitas peminjaman.</p>
                </div>
                <button @click="bukaModal" class="mt-4 md:mt-0 bg-rose-600 text-white px-4 py-2 rounded-lg shadow hover:bg-rose-700 font-bold text-sm">
                    Buat Transaksi
                </button>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
                <table class="min-w-full text-left">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">ID Trx</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Anggota</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Buku</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Periode Pinjam</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="peminjamanList.length === 0">
                            <td colspan="5" class="px-6 py-10 text-center text-gray-500 font-medium">Belum ada transaksi.</td>
                        </tr>
                        <tr v-for="trx in peminjamanList" :key="trx.id" class="border-b border-gray-100 hover:bg-rose-50/30">
                            <td class="px-6 py-4 text-sm font-bold text-gray-700">#{{ String(trx.id).padStart(4, '0') }}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-600">UID: {{ trx.id_user }}</td>
                            <td class="px-6 py-4 text-sm font-bold text-blue-700">{{ trx.judul_buku || trx.judul || 'ID Buku: ' + trx.id_buku }}</td>
                            <td class="px-6 py-4 text-sm text-gray-600">
                                <span class="font-semibold">{{ trx.tanggal_pinjam }}</span> s/d <span class="font-bold text-red-600">{{ trx.tanggal_kembali }}</span>
                            </td>
                            <td class="px-6 py-4 text-sm">
                                <span :class="(trx.status === 'dikembalikan' || trx.status_pinjam === 'dikembalikan' || trx.status_pinjam === 'selesai') ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'" class="px-2 py-1 rounded text-xs font-bold uppercase">
                                    {{ trx.status || trx.status_pinjam || 'dipinjam' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[9999] p-4">
                <div class="bg-white p-8 rounded-xl w-full max-w-md shadow-2xl">
                    <h2 class="text-xl font-black mb-6 text-gray-800 border-b border-gray-100 pb-3">Form Transaksi</h2>
                    <form @submit.prevent="simpanPeminjaman" class="space-y-4">
                        <div class="flex gap-4">
                            <div class="w-1/2">
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">ID User</label>
                                <input v-model="form.id_user" type="number" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                            </div>
                            <div class="w-1/2">
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">ID Buku</label>
                                <input v-model="form.id_buku" type="number" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div class="w-1/2">
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">Pinjam</label>
                                <input v-model="form.tanggal_pinjam" type="date" class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-rose-500" required>
                            </div>
                            <div class="w-1/2">
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">Jatuh Tempo</label>
                                <input v-model="form.tanggal_kembali" type="date" class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-rose-500" required>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-600 text-xs font-bold mb-1.5">Status</label>
                            <select v-model="form.status" class="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-rose-500" required>
                                <option value="dipinjam">Dipinjam</option>
                                <option value="dikembalikan">Dikembalikan</option>
                            </select>
                        </div>
                        <div class="flex justify-end mt-6 pt-4 border-t border-gray-100 gap-2">
                            <button type="button" @click="tutupModal" class="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-bold text-sm">Batal</button>
                            <button type="submit" class="bg-rose-600 text-white px-4 py-2 rounded shadow hover:bg-rose-700 font-bold text-sm">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            peminjamanList: [],
            showModal: false,
            form: { id_user: '', id_buku: '', tanggal_pinjam: '', tanggal_kembali: '', status: 'dipinjam' }
        }
    },
    mounted() { 
        this.getPeminjaman(); 
    },
    methods: {
        bukaModal() { this.showModal = true; },
        tutupModal() { 
            this.showModal = false;
            this.form = { id_user: '', id_buku: '', tanggal_pinjam: '', tanggal_kembali: '', status: 'dipinjam' };
        },
        async getPeminjaman() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/peminjaman', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                this.peminjamanList = res.data;
            } catch (e) { 
                console.error("Gagal mengambil data peminjaman", e);
            }
        },
        async simpanPeminjaman() {
            try {
                const token = localStorage.getItem('token');
                
                await axios.post('http://localhost:8080/api/peminjaman', this.form, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                this.tutupModal();
                this.getPeminjaman();
                alert('MANTAP! Transaksi peminjaman berhasil dicatat.');
            } catch (e) { 
                alert('Gagal menyimpan transaksi! Cek tab Console & Network bos.'); 
                console.error(e);
            }
        }
    }
};