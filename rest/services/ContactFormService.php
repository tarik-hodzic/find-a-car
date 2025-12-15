<?php
require_once __DIR__ . '/../dao/ContactFormsDAO.php';

class ContactFormService {
    private $contactFormDao;

    // konstruktor – inicijalizuje DAO koji komunicira sa 'contact_forms' tabelom
    public function __construct() {
        $this->contactFormDao = new ContactFormsDAO();
    }

    // vraca sve poruke iz kontakt forme
    public function getAllContacts() {
        return $this->contactFormDao->getAll();
    }

    // vraca jednu poruku po ID-u
    public function getContactById($id) {
        return $this->contactFormDao->getById($id);
    }

    // kreira novu poruku (unos korisnika preko kontakt forme)
    public function createContact($data) {
        return $this->contactFormDao->insert($data);
    }

    // azurira postojecu poruku (npr. oznaciti kao procitano)
    public function updateContact($id, $data) {
        return $this->contactFormDao->update($id, $data);
    }

    // brise kontakt poruku po ID-u
    public function deleteContact($id) {
        return $this->contactFormDao->delete($id);
    }
}
?>
