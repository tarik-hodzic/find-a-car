<?php
require_once 'BaseDao.php';

class UsersDAO extends BaseDao {
    public function __construct() {
        // postavlja tabelu 'users' za ovaj DAO
        parent::__construct('users');
    }

    // vraca korisnika iz baze na osnovu email adrese
    public function getUserByEmail($email) {
        $stmt = $this->connection->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
