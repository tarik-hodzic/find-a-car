<?php

require_once 'BaseService.php';
require_once __DIR__ . '/../dao/AuthDao.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $auth_dao;

    public function __construct() {
        $this->auth_dao = new AuthDao(); // instanciraj DAO za rad sa korisnicima
    }

    // vrati korisnika po emailu (koristi ga i register i login)
    public function get_user_by_email($email) {
        return $this->auth_dao->get_user_by_email($email);
    }

    // registracija korisnika
    public function register($entity) {
        // provjera da li su poslani svi podaci
        if (empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        // provjeri da li email vec postoji
        $email_exists = $this->auth_dao->get_user_by_email($entity['email']);
        if ($email_exists) {
            return ['success' => false, 'error' => 'Email already registered.'];
        }

        // hesiraj lozinku i upisi korisnika
        $entity['password'] = password_hash($entity['password'], PASSWORD_BCRYPT);
        $entity = $this->auth_dao->insert($entity); // ubacivanje korisnika u bazu
        unset($entity['password']); // ne saljemo password nazad

        return ['success' => true, 'data' => $entity];
    }

    // prijava korisnika
    public function login($entity) {
        // provjeri da li su poslani svi podaci
        if (empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        // pronadji korisnika po emailu
        $user = $this->auth_dao->get_user_by_email($entity['email']);
        if (!$user || !password_verify($entity['password'], $user['password'])) {
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        unset($user['password']); // ne saljemo password

        // kreiraj JWT token
        $jwt_payload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24) // token vazi 24h
        ];

        $token = JWT::encode($jwt_payload, Config::JWT_SECRET(), 'HS256');

        return ['success' => true, 'data' => array_merge($user, ['token' => $token])];
    }
}
