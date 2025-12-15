<?php
require_once __DIR__ . '/../dao/UsersDAO.php';

class UserService {
    private $userDao;

    public function __construct() {
        $this->userDao = new UsersDAO(); // inicijalizacija user dao-a
    }

    // vraca sve korisnike iz baze
    public function getAllUsers() {
        return $this->userDao->getAll();
    }

    // vraca jednog korisnika po id-u
    public function getUserById($id) {
        return $this->userDao->getById($id);
    }

    // kreira novog korisnika
    public function createUser($data) {
        return $this->userDao->insert($data);
    }

    // azurira postojeceg korisnika
    public function updateUser($id, $data) {
        return $this->userDao->update($id, $data);
    }

    // brise korisnika iz baze
    public function deleteUser($id) {
        return $this->userDao->delete($id);
    }
}
?>
