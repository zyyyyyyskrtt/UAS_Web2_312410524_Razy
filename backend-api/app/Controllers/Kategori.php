<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Kategori extends ResourceController
{
    use ResponseTrait;
    
    // Inisialisasi Model yang dipakai
    protected $modelName = 'App\Models\KategoriModel';
    protected $format    = 'json';

    // GET: Ambil semua data
    public function index()
{
    $data = $this->model->findAll();
    return $this->respond($data, 200);
}

    // GET: Ambil satu data berdasarkan ID
    public function show($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            return $this->respond($data, 200);
        }
        return $this->failNotFound('Data tidak ditemukan');
    }

    // POST: Tambah data baru
    public function create()
    {
        $data = $this->request->getPost();
        
        if ($this->model->insert($data)) {
            $response = [
                'status'   => 201,
                'error'    => null,
                'messages' => [
                    'success' => 'Kategori berhasil ditambahkan'
                ]
            ];
            return $this->respondCreated($response);
        }
        return $this->fail($this->model->errors());
    }

    // PUT: Ubah data
    public function update($id = null)
    {
        $data = $this->request->getRawInput();
        
        if ($this->model->update($id, $data)) {
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Kategori berhasil diubah'
                ]
            ];
            return $this->respond($response);
        }
        return $this->fail($this->model->errors());
    }

    // DELETE: Hapus data
    public function delete($id = null)
    {
        $data = $this->model->find($id);
        if ($data) {
            $this->model->delete($id);
            $response = [
                'status'   => 200,
                'error'    => null,
                'messages' => [
                    'success' => 'Kategori berhasil dihapus'
                ]
            ];
            return $this->respondDeleted($response);
        }
        return $this->failNotFound('Data tidak ditemukan');
    }
}