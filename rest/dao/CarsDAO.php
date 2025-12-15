<?php
require_once 'BaseDao.php';

class CarsDAO extends BaseDao {
    public function __construct() {
        parent::__construct('cars'); // poziv roditeljskog konstruktora sa tabelom 'cars'
    }

    // vraca sve dostupne regularne aute (availability = 1, is_special = 0)
    public function getAvailableCars() {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM cars WHERE availability = 1 AND is_special = 0");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    // postavlja dostupnost auta na 0 ili 1 (zauzet ili slobodan)
    public function set_availability($car_id, $status) {
        try {
            $stmt = $this->conn->prepare("UPDATE cars SET availability = :status WHERE id = :id");
            $stmt->execute([
                'status' => $status,
                'id' => $car_id
            ]);
            error_log("🧪 UPDATE success: car_id = $car_id, status = $status");
        } catch (PDOException $e) {
            error_log("❌ Greska prilikom postavljanja dostupnosti: " . $e->getMessage());
        }
    }

    // unosi novi auto u bazu (ukljucuje i is_special i description)
    public function insert($car) {
        $stmt = $this->conn->prepare("
            INSERT INTO cars (brand, model, year, price_per_day, availability, image, is_special, description)
            VALUES (:brand, :model, :year, :price_per_day, :availability, :image, :is_special, :description)
        ");

        $stmt->execute([
            'brand' => $car['brand'],
            'model' => $car['model'],
            'year' => $car['year'],
            'price_per_day' => $car['price_per_day'],
            'availability' => $car['availability'],
            'image' => $car['image'],
            'is_special' => $car['is_special'] ?? 0,
            'description' => $car['description'] ?? null
        ]);

        return $this->getById($this->conn->lastInsertId());
    }

    // azurira postojeci auto po id-u, ukljucujuci specijalnost i opis
    public function update($id, $car) {
        $stmt = $this->conn->prepare("
            UPDATE cars SET
                brand = :brand,
                model = :model,
                year = :year,
                price_per_day = :price_per_day,
                availability = :availability,
                image = :image,
                is_special = :is_special,
                description = :description
            WHERE id = :id
        ");

        $stmt->execute([
            'brand' => $car['brand'],
            'model' => $car['model'],
            'year' => $car['year'],
            'price_per_day' => $car['price_per_day'],
            'availability' => $car['availability'],
            'image' => $car['image'],
            'is_special' => $car['is_special'] ?? 0,
            'description' => $car['description'] ?? null,
            'id' => $id
        ]);

        return $this->getById($id);
    }

    // vraca sve specijalne aute iz baze (is_special = 1)
    public function getSpecialCars() {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM cars WHERE is_special = 1");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("❌ Greska u getSpecialCars: " . $e->getMessage());
            return [];
        }
    }

}
?>
