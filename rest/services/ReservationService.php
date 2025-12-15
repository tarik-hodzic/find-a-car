<?php
require_once __DIR__ . '/../dao/ReservationsDAO.php';
require_once __DIR__ . '/../dao/CarsDAO.php'; 

class ReservationService {
    private $reservationDao;
    private $carDao; // nova dao instanca

    public function __construct() {
        $this->reservationDao = new ReservationsDAO();
        $this->carDao = new CarsDAO(); // inicijalizuj car dao
    }

    // vraca sve rezervacije iz baze
    public function getAllReservations() {
        return $this->reservationDao->getAll();
    }

    // vraca rezervaciju po id-u
    public function getReservationById($id) {
        return $this->reservationDao->getById($id);
    }

    // kreira novu rezervaciju
    public function createReservation($data) {
        error_log("🟡 createReservation pozvana!");
        error_log("📦 primljeni podaci: " . json_encode($data));

        try {
            // mapiranje frontend polja u db nazive
            $data['start_date'] = $data['date_from'] ?? $data['start_date'];
            $data['end_date'] = $data['date_to'] ?? $data['end_date'];

            // validacija da li su svi podaci prisutni
            if (!isset($data['user_id']) || !isset($data['car_id']) || !isset($data['start_date']) || !isset($data['end_date']) || !isset($data['total_price'])) {
                throw new Exception("nedostaju potrebni podaci za rezervaciju.");
            }

            // insert rezervacije u bazu
            $result = $this->reservationDao->insert($data);

            // ako je uspjesno, postavi auto kao unavailable
            if ($result && isset($data['car_id'])) {
                $this->carDao->set_availability($data['car_id'], 0);
                error_log("✅ auto postavljen kao unavailable: " . $data['car_id']);
            }

            return $result;

        } catch (Exception $e) {
            error_log("❌ greska u reservationservice: " . $e->getMessage());
            Flight::halt(500, "greska prilikom rezervacije: " . $e->getMessage());
        }
    }

    // azurira postojecu rezervaciju
    public function updateReservation($id, $data) {
        return $this->reservationDao->update($id, $data);
    }

    // brise rezervaciju po id-u
    public function deleteReservation($id) {
        return $this->reservationDao->delete($id);
    }
}
?>
