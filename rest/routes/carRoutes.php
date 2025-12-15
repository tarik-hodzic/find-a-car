<?php
require_once __DIR__ . '/../services/CarService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$auth = new AuthMiddleware();

// ======= ZASTICENE RUTE ZA ADMINA =======

// vraca sve aute (samo admin moze pristupiti)
Flight::route('GET /api/cars', function () use ($auth) {
    $auth->verifyToken(); // validacija tokena
    $auth->authorizeRole("admin"); // samo admini mogu

    $service = new CarService();
    Flight::json($service->getAllCars());
});

// vraca podatke za jedan auto po ID-u
Flight::route('GET /api/cars/@id', function ($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new CarService();
    Flight::json($service->getCarById($id));
});

// kreira novi auto (admin)
Flight::route('POST /api/cars', function () use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData(); // uzima podatke iz zahtjeva
    $service = new CarService();
    Flight::json($service->createCar($data));
});

// azurira postojeceg auta (admin)
Flight::route('PUT /api/cars/@id', function ($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData();
    $service = new CarService();
    Flight::json($service->updateCar($id, $data));
});

// brise auto po ID-u (admin)
Flight::route('DELETE /api/cars/@id', function ($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new CarService();
    Flight::json($service->deleteCar($id));
});

// ======= JAVNA RUTA ZA DOSTUPNE AUTE =======

// vraca samo dostupne regularne aute (dropdown na pocetnoj)
Flight::route('GET /cars/available', function () {
    Flight::json(Flight::car_service()->getAvailableCars());
});

// ruta za special aute (vidljivo adminima u dashboardu)
Flight::route('GET /api/cars/special', function () use ($auth) {
    $auth->verifyToken();

    $service = new CarService();
    Flight::json($service->getSpecialCars());
});

// ruta za special aute (cars.html, dostupno i korisnicima i adminima)
Flight::route('GET /api/cars/special/all', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);

    $service = new CarService();
    $specialCars = $service->getSpecialCars();

    Flight::json($specialCars);
});
