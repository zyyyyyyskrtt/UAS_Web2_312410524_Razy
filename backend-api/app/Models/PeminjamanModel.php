<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table            = 'peminjaman';
    protected $primaryKey       = 'id';
    
    // INI YANG PALING PENTING BOS! Jangan sampai 'status' ketinggalan
    protected $allowedFields = [
    'id_user', 
    'id_buku', 
    'tanggal_pinjam', 
    'tanggal_kembali', 
    'status' // INI WAJIB ADA BOS!
];
}