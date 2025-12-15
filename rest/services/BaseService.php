<?php

class BaseService {
    // DAO objekat (data access object)
    protected $dao;

    // Konstruktor prima DAO objekat (npr. UsersDAO, CarsDAO itd.)
    public function __construct($dao) {
        $this->dao = $dao;
    }

    // Vrati sve zapise iz tabele
    public function get_all() {
        return $this->dao->getAll();
    }

    // Vrati jedan zapis po ID-u
    public function get_by_id($id) {
        return $this->dao->getById($id);
    }

    // Ubaci novi entitet u bazu
    public function add($entity) {
        return $this->dao->insert($entity);
    }

    // Azuriraj postojeceg po ID-u
    public function update($id, $entity) {
        return $this->dao->update($id, $entity);
    }

    // Obrisi entitet po ID-u
    public function delete($id) {
        return $this->dao->delete($id);
    }
}
