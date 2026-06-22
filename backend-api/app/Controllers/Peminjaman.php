<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Peminjaman extends ResourceController
{
    use ResponseTrait;

    protected $modelName = 'App\Models\PeminjamanModel';
    protected $format    = 'json';

    // GET: Ambil semua data peminjaman + judul bukunya
    public function index()
    {
        // KODE FINAL: Join-nya sekarang ke tabel 'buku', bukan 'komik' lagi
        $data = $this->model->select('peminjaman.*, buku.judul AS judul_buku')
                            ->join('buku', 'buku.id = peminjaman.id_buku', 'left')
                            ->findAll();
                            
        return $this->respond($data, 200);
    }

    // POST: Tambah data peminjaman baru
    public function create()
    {
        // KODE FINAL: Nangkap input id_buku dari form frontend
        $data = [
            'id_user'         => $this->request->getVar('id_user'),
            'id_buku'         => $this->request->getVar('id_buku'),
            'tanggal_pinjam'  => $this->request->getVar('tanggal_pinjam'),
            'tanggal_kembali' => $this->request->getVar('tanggal_kembali'),
            'status_pinjam'   => $this->request->getVar('status_pinjam')
        ];

        if ($this->model->insert($data)) {
            $response = [
                'status'   => 201,
                'messages' => ['success' => 'Transaksi peminjaman berhasil ditambahkan']
            ];
            return $this->respondCreated($response);
        }
        
        return $this->fail($this->model->errors());
    }

    // PUT/PATCH: Proses pengembalian buku
    public function update($id = null)
    {
        // Ubah status jadi selesai dan set tanggal_kembali jadi hari ini
        $data = [
            'status_pinjam'   => 'selesai',
            'tanggal_kembali' => date('Y-m-d') 
        ];

        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Buku berhasil dikembalikan!']);
        }
        return $this->fail('Gagal update data');
    }
}