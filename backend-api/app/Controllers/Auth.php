<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait; 
use Firebase\JWT\JWT; // <-- Pastikan baris ini ada!

class Auth extends ResourceController
{
    use ResponseTrait;

    // Endpoint buat bikin akun Admin
    public function register()
    {
        $rules = [
            'nama'     => 'required',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $model = new \App\Models\UserModel();
        $data = [
            'nama'     => $this->request->getVar('nama'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
            'role'     => 'admin' // Otomatis kita set sebagai admin
        ];

        $model->insert($data);
        return $this->respondCreated(['message' => 'Akun admin berhasil dibuat']);
    }

    // Endpoint buat Login dan cetak Token
    public function login()
    {
        $model = new \App\Models\UserModel();
        
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $model->where('email', $email)->first();

        if (!$user) {
            return $this->failNotFound('Email tidak ditemukan');
        }

        $verify = password_verify($password, $user['password']);
        if (!$verify) {
            return $this->fail('Password salah');
        }

        // Bikin Token JWT
        $key = 'kunci_rahasia_fajar_maher_habibillah_super_aman_123'; // Secret key JWT
        $payload = [
            'iat'   => time(), // Waktu token dibuat
            'exp'   => time() + (60 * 60 * 24), // Token expired dalam 24 Jam
            'uid'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role']
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'message' => 'Login Berhasil',
            'token'   => $token,
            'user'    => [
                'nama'  => $user['nama'],
                'role'  => $user['role']
            ]
        ]);
    }

}