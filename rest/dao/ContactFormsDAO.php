<?php
require_once 'BaseDao.php';

class ContactFormsDAO extends BaseDao {
    public function __construct() {
        // poziva konstruktor roditeljske klase sa tabelom contact_forms
        parent::__construct('contact_forms');
    }

    // vraca sve poruke koje imaju status 'unread'
    public function getUnreadMessages() {
        $stmt = $this->connection->query("SELECT * FROM contact_forms WHERE status = 'unread'");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ubacuje novu poruku u contact_forms tabelu (sa timestamp-om NOW())
    public function insert($data) {
        $stmt = $this->conn->prepare("INSERT INTO contact_forms (user_id, name, surname, email, message, created_at)
                                      VALUES (:user_id, :name, :surname, :email, :message, NOW())");
        $stmt->execute([
            'user_id' => $data['user_id'],
            'name' => $data['name'],
            'surname' => $data['surname'],
            'email' => $data['email'],
            'message' => $data['message']
        ]);
        return ['success' => true];
    }
}
?>
