<?php
require_once __DIR__ . '/../dao/CarsDAO.php';

class CarService {
    private $carDao;

    // konstruktor – inicijalizuje DAO koji komunicira sa 'cars' tabelom
    public function __construct() {
        $this->carDao = new CarsDAO();
    }

    // vrati sve aute (za admin dashboard)
    public function getAllCars() {
        return $this->carDao->getAll();
    }

    // vrati jedan auto po ID-u
    public function getCarById($id) {
        return $this->carDao->getById($id);
    }

    // kreiraj novi auto unos
    public function createCar($data) {
        return $this->carDao->insert($data);
    }

    // azuriraj postojeci auto
    public function updateCar($id, $data) {
        return $this->carDao->update($id, $data);
    }

    // obrisi auto
    public function deleteCar($id) {
        return $this->carDao->delete($id);
    }

    // vraca dostupne regularne aute (za dropdown na home stranici)
    public function getAvailableCars() {
        return $this->carDao->getAvailableCars();
    }

    // vraca special aute (za kartice na cars.html i za admin dashboard)
    public function getSpecialCars() {
        return $this->carDao->getSpecialCars();
    }
}
?>
