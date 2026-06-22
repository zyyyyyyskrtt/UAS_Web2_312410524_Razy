<?php

namespace App\Models;

use CodeIgniter\Model;

class BukuModel extends Model
{
    protected $table            = 'buku';
    protected $primaryKey       = 'id';
    
    // INI YANG BENER BOS! Isian khusus buat tabel buku
    protected $allowedFields    = [
        'id_kategori', 
        'judul', 
        'penulis', 
        'penerbit', 
        'status_ketersediaan', 
        'cover'
    ];
}