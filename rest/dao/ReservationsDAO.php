<?php
require_once 'BaseDao.php';

class ReservationsDAO extends BaseDao {
    public function __construct() {
        // poziva konstruktor roditeljske klase i postavlja tabelu na 'reservations'
        parent::__construct('reservations');
    }

    // vraca sve rezervacije koje pripadaju odredjenom korisniku
    public function getReservationsByUser($userId) {
        $stmt = $this->conn->prepare("SELECT * FROM reservations WHERE user_id = :userId");
        $stmt->bindParam(':userId', $userId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // ubacuje novu rezervaciju u bazu i vraca unesene podatke zajedno sa ID-em
    public function insert($data) {
        try {
            // debug
            error_log("🧾 Podaci za rezervaciju:");
            error_log(json_encode($data));

            $stmt = $this->conn->prepare("INSERT INTO reservations (user_id, car_id, start_date, end_date, total_price)
                                          VALUES (:user_id, :car_id, :start_date, :end_date, :total_price)");
            $stmt->execute([
                'user_id' => $data['user_id'],
                'car_id' => $data['car_id'],
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'total_price' => $data['total_price']
            ]);

            $data['id'] = $this->conn->lastInsertId(); // dodaje ID novog reda
            return $data;

        } catch (PDOException $e) {
            // u slucaju greske salje status 500 i ispisuje poruku kao JSON
            http_response_code(500);
            echo json_encode(["error" => "❌ BACKEND GREŠKA: " . $e->getMessage()]);
            exit;
        }
    }
}
?>
