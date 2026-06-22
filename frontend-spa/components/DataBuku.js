const DataBuku = {
    template: `
        <div class="w-full">
            <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                    <h1 class="text-2xl font-black text-gray-800">Katalog Buku</h1>
                    <p class="text-gray-500 text-sm mt-1">Kelola data inventaris buku perpustakaan.</p>
                </div>
                <button @click="bukaModalBaru" class="mt-4 md:mt-0 bg-rose-600 text-white px-4 py-2 rounded-lg shadow hover:bg-rose-700 font-bold text-sm">
                    + Registrasi Buku
                </button>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
                <table class="min-w-full text-left">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Data Buku</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Kategori & Penerbit</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Ketersediaan</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Opsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="bukuList.length === 0">
                            <td colspan="4" class="px-6 py-10 text-center text-gray-500 font-medium">Katalog masih kosong.</td>
                        </tr>
                        <tr v-for="buku in bukuList" :key="buku.id" class="border-b border-gray-100 hover:bg-rose-50/30">
                            <td class="px-6 py-4 flex items-center gap-4">
                                <img v-if="buku.cover" :src="'http://localhost:8080/uploads/' + buku.cover" class="w-12 h-16 object-cover rounded shadow-sm border border-gray-200">
                                <div v-else class="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold">NO IMG</div>
                                <div>
                                    <div class="text-sm font-bold text-gray-900">{{ buku.judul }}</div>
                                    <div class="text-xs text-gray-500 mt-0.5">Penulis: {{ buku.penulis }}</div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded text-xs font-bold inline-block mb-1">{{ buku.nama_kategori || 'Tanpa Kategori' }}</span>
                                <div class="text-xs text-gray-500 font-medium">{{ buku.penerbit }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="buku.status_ketersediaan === 'tersedia' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'" class="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide">{{ buku.status_ketersediaan }}</span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button @click="editBuku(buku)" class="text-blue-600 hover:text-blue-800 font-bold text-xs mr-3 underline">Edit</button>
                                <button @click="hapusBuku(buku.id)" class="text-red-600 hover:text-red-800 font-bold text-xs underline">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-[9999] p-4">
                <div class="bg-white p-8 rounded-xl w-full max-w-lg shadow-2xl">
                    <h2 class="text-xl font-black mb-6 text-gray-800 border-b border-gray-100 pb-3">{{ isEdit ? 'Edit Data Buku' : 'Registrasi Buku Baru' }}</h2>
                    <form @submit.prevent="simpanBuku" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">ID Kategori</label>
                                <input type="number" v-model="form.id_kategori" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">Status</label>
                                <select v-model="form.status_ketersediaan" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                                    <option value="tersedia">Tersedia</option>
                                    <option value="dipinjam">Dipinjam</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-600 text-xs font-bold mb-1.5">Judul Buku</label>
                            <input v-model="form.judul" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">Penulis</label>
                                <input v-model="form.penulis" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                            </div>
                            <div>
                                <label class="block text-gray-600 text-xs font-bold mb-1.5">Penerbit</label>
                                <input v-model="form.penerbit" class="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-rose-500 text-sm" required>
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-600 text-xs font-bold mb-1.5">Unggah Cover</label>
                            <input type="file" @change="handleFileUpload" accept="image/*" class="w-full text-sm text-gray-500 border border-gray-300 rounded p-1">
                        </div>
                        <div class="flex justify-end mt-6 pt-4 border-t border-gray-100 gap-2">
                            <button type="button" @click="tutupModal" class="px-4 py-2 bg-white border border-gray-300 rounded text-gray-700 font-bold text-sm">Batal</button>
                            <button type="submit" class="bg-rose-600 text-white px-4 py-2 rounded shadow hover:bg-rose-700 font-bold text-sm">{{ isEdit ? 'Update' : 'Simpan' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            bukuList: [],
            showModal: false,
            isEdit: false,
            form: { id: null, id_kategori: 1, judul: '', penulis: '', penerbit: '', status_ketersediaan: 'tersedia', cover: null } 
        }
    },
    mounted() { this.getBuku(); },
    methods: {
        bukaModalBaru() { 
            this.isEdit = false;
            this.form = { id: null, id_kategori: 1, judul: '', penulis: '', penerbit: '', status_ketersediaan: 'tersedia', cover: null };
            this.showModal = true; 
        },
        tutupModal() { 
            this.showModal = false; 
            this.form.cover = null; 
            this.isEdit = false;
        },
        handleFileUpload(event) { this.form.cover = event.target.files[0]; },
        
        async getBuku() {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/buku', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                this.bukuList = res.data;
            } catch (e) { console.error(e); }
        },

        editBuku(buku) {
            this.isEdit = true;
            this.form = { ...buku, cover: null }; 
            this.showModal = true;
        },

        async hapusBuku(id) {
            if(confirm('Yakin mau hapus data master buku ini bos?')) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete('http://localhost:8080/api/buku/' + id, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    alert('MANTAP! Data master berhasil dihapus.');
                    this.getBuku(); 
                } catch (e) {
                    alert('Gagal menghapus data! Cek console.');
                    console.error(e);
                }
            }
        },
        
        async simpanBuku() {
            try {
                const fd = new FormData();
                fd.append('id_kategori', this.form.id_kategori); 
                fd.append('judul', this.form.judul);
                fd.append('penulis', this.form.penulis);
                fd.append('penerbit', this.form.penerbit);
                fd.append('status_ketersediaan', this.form.status_ketersediaan);
                
                if (this.form.cover) { 
                    fd.append('cover', this.form.cover); 
                }

                const token = localStorage.getItem('token');
                const config = {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                };

                if (this.isEdit) {
                    fd.append('_method', 'PUT');
                    await axios.post('http://localhost:8080/api/buku/' + this.form.id, fd, config);
                    alert('Sip! Data buku berhasil di-update.');
                } else {
                    await axios.post('http://localhost:8080/api/buku', fd, config);
                    alert('MANTAP! Buku + Cover berhasil ditambahkan.');
                }
                
                this.tutupModal();
                this.getBuku();
            } catch (e) { 
                alert('Gagal menyimpan data! Cek console browser lu bos.'); 
                console.error(e); 
            }
        }
    }
};