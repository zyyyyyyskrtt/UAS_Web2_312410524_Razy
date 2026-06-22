const Login = {
    template: `
    <div class="min-h-screen flex bg-white font-sans">
        <!-- Panel Kiri: Ilustrasi -->
        <div class="hidden lg:flex w-1/2 bg-rose-700 text-white flex-col justify-center px-20 relative overflow-hidden">
            <div class="absolute inset-0 bg-rose-900 opacity-20 transform -skew-y-12 scale-150"></div>
            <div class="relative z-10">
                <div class="text-7xl mb-8">📚</div>
                <h1 class="text-5xl font-black tracking-tight mb-6 leading-tight">Sistem<br>Manajemen<br>RentBook.</h1>
                <p class="text-rose-200 text-lg max-w-md leading-relaxed">Portal khusus Pustakawan untuk mengelola sirkulasi peminjaman, pengembalian, dan katalog literatur digital.</p>
            </div>
        </div>

        <!-- Panel Kanan: Form -->
        <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
            <div class="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div class="mb-10 lg:hidden text-center">
                    <span class="text-5xl text-rose-600">📚</span>
                    <h2 class="text-3xl font-black text-rose-600 mt-4 tracking-tight">RentBook.</h2>
                </div>
                
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Selamat Datang</h2>
                <p class="text-gray-500 mb-8">Silakan masukkan kredensial akun Anda.</p>

                <form @submit.prevent="login" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Email Pustakawan</label>
                        <input type="email" v-model="email" required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-800"
                            placeholder="admin@rentbook.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
                        <input type="password" v-model="password" required
                            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-800"
                            placeholder="••••••••">
                    </div>

                    <button type="submit" 
                        class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-lg shadow-md transition-all mt-4">
                        Masuk ke Dashboard
                    </button>
                </form>
            </div>
        </div>
    </div>
    `,
    data() { return { email: '', password: '' } },
    methods: {
        async login() {
            try {
                let formData = new FormData();
                formData.append('email', this.email);
                formData.append('password', this.password);
                const response = await axios.post('http://localhost:8080/api/login', formData);
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.hash = '#/dashboard';
            } catch (error) {
                alert('Gagal login! Cek lagi email sama passwordnya ya.');
                console.error(error);
            }
        }
    }
};