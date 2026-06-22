<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Buku extends ResourceController
{
    use ResponseTrait;

    protected $modelName = 'App\Models\BukuModel';
    protected $format    = 'json';

    // GET: Ambil semua data buku
    public function index()
    {
        // KODE FINAL: Join tabel buku dengan kategori biar nama_kategori kebawa
        $data = $this->model->select('buku.*, kategori.nama_kategori')
                            ->join('kategori', 'kategori.id = buku.id_kategori', 'left')
                            ->findAll();
                            
        return $this->respond($data, 200);
    }

    // GET: Ambil satu data buku berdasarkan ID
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data, 200);
        }
        return $this->failNotFound('Data buku tidak ditemukan');
    }

    // POST: Tambah data buku baru + Upload Cover
    public function create()
    {
        // 1. Tangkap data teks pakai getVar() biar lebih ampuh nangkep FormData
        $data = [
            'id_kategori'         => $this->request->getVar('id_kategori'),
            'judul'               => $this->request->getVar('judul'),
            'penulis'             => $this->request->getVar('penulis'),
            'penerbit'            => $this->request->getVar('penerbit'),
            'status_ketersediaan' => $this->request->getVar('status_ketersediaan'),
        ];
        
        // 2. Tangkap file gambar 'cover'
        $fileCover = $this->request->getFile('cover');

        // 3. Proses upload jika ada file cover yang valid
        if ($fileCover && $fileCover->isValid() && ! $fileCover->hasMoved()) {
            // Generate nama file random agar tidak ada nama yang bentrok
            $namaCover = $fileCover->getRandomName();
            
            // Pindahkan cover ke folder public/uploads di backend
            $fileCover->move(ROOTPATH . 'public/uploads', $namaCover);
            
            // Masukkan nama cover ke array untuk disimpan di database
            $data['cover'] = $namaCover;
        }

        // 4. Simpan ke database
        if ($this->model->insert($data)) {
            $response = [
                'status'   => 201,
                'error'    => null,
                'messages' => [
                    'success' => 'MANTAP! Data buku dan cover berhasil ditambahkan'
                ]
            ];
            return $this->respondCreated($response);
        }
        return $this->fail($this->model->errors());
    }

    // PUT/PATCH: Ubah data buku (INI YANG UDAH DIPERBAIKI BOS!)
    public function update($id = null)
    {
        // 1. Tangkap data pakai getPost() karena kita pakai trick _method=PUT dari Vue
        $data = [
            'id_kategori'         => $this->request->getPost('id_kategori'),
            'judul'               => $this->request->getPost('judul'),
            'penulis'             => $this->request->getPost('penulis'),
            'penerbit'            => $this->request->getPost('penerbit'),
            'status_ketersediaan' => $this->request->getPost('status_ketersediaan')
        ];

        // 2. Cek apakah ada file cover BARU yang di-upload pas ngedit
        $fileCover = $this->request->getFile('cover');
        if ($fileCover && $fileCover->isValid() && !$fileCover->hasMoved()) {
            
            // (Opsional) Hapus file cover lama di folder uploads biar storage nggak penuh
            $bukuLama = $this->model->find($id);
            if ($bukuLama && !empty($bukuLama['cover']) && file_exists(ROOTPATH . 'public/uploads/' . $bukuLama['cover'])) {
                unlink(ROOTPATH . 'public/uploads/' . $bukuLama['cover']);
            }

            // Generate nama cover baru dan pindahkan
            $namaCover = $fileCover->getRandomName();
            $fileCover->move(ROOTPATH . 'public/uploads', $namaCover);
            $data['cover'] = $namaCover; // Masukin nama file baru ke data update
        }

        // 3. Bersihkan data kosong (null) biar nggak nimpa data lama dengan kekosongan
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        // 4. Pastikan data tidak kosong sebelum update
        if (empty($data)) {
            return $this->fail('Tidak ada data yang dikirim untuk di-update.');
        }

        // 5. Eksekusi simpan perubahan ke database
        if ($this->model->update($id, $data)) {
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Sip! Data buku berhasil di-update'
                ]
            ];
            return $this->respond($response);
        }
        
        return $this->fail($this->model->errors());
    }

    // DELETE: Hapus data buku + Hapus file fisiknya
    public function delete($id = null)
    {
        $data = $this->model->find($id);
        
        if ($data) {
            // Cek dan hapus file cover fisik di folder uploads
            if (!empty($data['cover']) && file_exists(ROOTPATH . 'public/uploads/' . $data['cover'])) {
                unlink(ROOTPATH . 'public/uploads/' . $data['cover']);
            }

            // Hapus data dari database
            $this->model->delete($id);
            
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Data buku dan cover berhasil dihapus'
                ]
            ];
            return $this->respondDeleted($response);
        }
        return $this->failNotFound('Data buku tidak ditemukan');
    }
}