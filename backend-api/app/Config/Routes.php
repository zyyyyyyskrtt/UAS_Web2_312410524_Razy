<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

// Mengelompokkan semua route API dan memasang proteksi CORS
$routes->group('api', ['filter' => 'cors'], static function ($routes) {
    
    // BARIS AJAIB: Untuk menangkap dan mengizinkan Preflight Request (OPTIONS) dari browser
    $routes->options('(:any)', static function () {});

    // Route untuk Auth
    $routes->post('register', 'Auth::register');
    $routes->post('login', 'Auth::login');

    // Route untuk Master Data
    $routes->resource('kategori', ['controller' => 'Kategori', 'filter' => 'auth']);
    $routes->resource('buku', ['controller' => 'Buku', 'filter' => 'auth']);
    // INI DIA YANG BENER BOS (Kata 'api/' dihapus!)
    $routes->resource('peminjaman', ['controller' => 'Peminjaman', 'filter' => 'auth']);
});