<?php
require_once __DIR__ . '/../Database.php';

class BaseDao {
    protected $conn;
    protected $table;

    // konstruktor koji povezuje na bazu i postavlja naziv tabele
    public function __construct($table) {
        $this->conn = Database::connect();
        $this->table = $table;
    }

    // metoda koja vraca sve zapise iz tabele
    public function getAll() {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table}");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // metoda koja vraca jedan zapis po id-u
    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    // metoda za unos novog zapisa u tabelu
    public function insert($data) {
        $keys = implode(',', array_keys($data));
        $placeholders = ':' . implode(',:', array_keys($data));
        $stmt = $this->conn->prepare("INSERT INTO {$this->table} ({$keys}) VALUES ({$placeholders})");
        $stmt->execute($data);
        $data['id'] = $this->conn->lastInsertId(); // dodaje id novog zapisa
        return $data;
    }

    // metoda za azuriranje postojeceg zapisa po id-u
    public function update($id, $data) {
        $fields = "";
        foreach ($data as $key => $value) {
            $fields .= "{$key} = :{$key}, ";
        }
        $fields = rtrim($fields, ', ');
        $data['id'] = $id;
        $stmt = $this->conn->prepare("UPDATE {$this->table} SET {$fields} WHERE id = :id");
        $stmt->execute($data);
        return $data;
    }

    // metoda za brisanje zapisa po id-u
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return ['status' => 'success'];
    }

    // metoda za izvrsavanje custom upita i vracanje vise rezultata
    public function query($query, $params = []) {
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // metoda za izvrsavanje custom upita i vracanje samo jednog rezultata
    public function query_unique($query, $params = []) {
        $results = $this->query($query, $params);
        return count($results) > 0 ? $results[0] : null;
    }
}
