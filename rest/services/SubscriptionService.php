<?php
require_once __DIR__ . '/../dao/SubscriptionsDAO.php';

class SubscriptionService {
    private $subscriptionDao;

    public function __construct() {
        $this->subscriptionDao = new SubscriptionsDAO(); // inicijalizacija dao-a
    }

    // vraca sve subskripcije (admin moze vidjeti sve)
    public function getAllSubscriptions() {
        return $this->subscriptionDao->getAll();
    }

    // vraca jednu subskripciju po id-u
    public function getSubscriptionById($id) {
        return $this->subscriptionDao->getById($id);
    }

    // kreira novu subskripciju (template ili korisnicku)
    public function createSubscription($data) {
        return $this->subscriptionDao->insert($data); // ocekuje plan, price, description itd.
    }

    // azurira subskripciju po id-u
    public function updateSubscription($id, $data) {
        return $this->subscriptionDao->update($id, $data); // ocekuje sve podatke za azuriranje
    }

    // brise subskripciju po id-u
    public function deleteSubscription($id) {
        return $this->subscriptionDao->delete($id);
    }

    // vraca samo template subskripcije (is_template = 1)
    public function getTemplateSubscriptions() {
        return $this->subscriptionDao->getTemplatesOnly();
    }

    // vraca aktivnu subskripciju za korisnika (is_template = 0)
    public function getActiveSubscriptionForUser($user_id) {
        $all = $this->subscriptionDao->getAllUserSubscriptions();

        foreach ($all as $sub) {
            if ($sub['user_id'] == $user_id) return $sub;
        }

        return null;
    }
}
?>
