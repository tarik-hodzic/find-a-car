<?php
require_once 'BaseDao.php';

class SubscriptionsDAO extends BaseDao {
    public function __construct() {
        // poziva konstruktor roditeljske klase i postavlja tabelu na 'subscriptions'
        parent::__construct('subscriptions');
    }

    // vraca sve subscription planove koji su template = 1 (admin dashboard koristi ovo)
    public function getTemplatesOnly() {
        $stmt = $this->conn->query("SELECT * FROM subscriptions WHERE is_template = 1");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // vraca sve pretplate koje su dodijeljene korisnicima (is_template = 0)
    public function getAllUserSubscriptions() {
        $stmt = $this->conn->query("SELECT * FROM subscriptions WHERE is_template = 0");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // vraca jednu pretplatu po ID-u
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM subscriptions WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // ubacuje novu korisnicku pretplatu (is_template = 0)
    public function insert($subscription) {
        $stmt = $this->conn->prepare("INSERT INTO subscriptions (plan, price, description, user_id, start_date, end_date, is_template)
                                    VALUES (:plan, :price, :description, :user_id, :start_date, :end_date, 0)");
        $stmt->execute([
            'plan' => $subscription['plan'],
            'price' => $subscription['price'],
            'description' => $subscription['description'] ?? null,
            'user_id' => $subscription['user_id'] ?? null,
            'start_date' => $subscription['start_date'] ?? null,
            'end_date' => $subscription['end_date'] ?? null
        ]);
        return $this->getById($this->conn->lastInsertId());
    }

    // azurira podatke o pretplati (koristi se u admin panelu)
    public function update($id, $subscription) {
        $stmt = $this->conn->prepare("UPDATE subscriptions SET
                                      plan = :plan,
                                      price = :price,
                                      description = :description
                                      WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'plan' => $subscription['plan'],
            'price' => $subscription['price'],
            'description' => $subscription['description'] ?? null
        ]);
        return $this->getById($id);
    }

    // brise pretplatu iz baze po ID-u
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM subscriptions WHERE id = :id");
        $stmt->execute(['id' => $id]);
    }
}
?>
