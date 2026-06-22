<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // 1. Biarkan metode GET bebas diakses (Untuk Pengunjung Publik)
        $method = strtolower($request->getMethod());
        if ($method === 'get' || $method === 'options') {
            return;
        }

        $key = 'kunci_rahasia_fajar_maher_habibillah_super_aman_123';
        $header = $request->getHeaderLine('Authorization');
        $token = null;

        // 2. Ekstrak token dari header Bearer
        if (!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }

        // 3. Jika token kosong, langsung tendang (Error 401)
        if (is_null($token) || empty($token)) {
            $response = service('response');
            $response->setJSON(['message' => 'Akses ditolak, Token tidak ditemukan']);
            $response->setStatusCode(401);
            return $response;
        }

        // 4. Jika token ada, verifikasi keaslian dan masa berlakunya
        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
        } catch (\Exception $ex) {
            $response = service('response');
            $response->setJSON(['message' => 'Token tidak valid atau sudah kadaluarsa']);
            $response->setStatusCode(401);
            return $response;
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do nothing
    }
}