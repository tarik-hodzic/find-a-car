<?php
require_once __DIR__ . '/../services/ReservationService.php';

// ======================== REZERVACIJE RUTE ========================

// vraca sve rezervacije (samo ako je user ili admin)
Flight::route('GET /reservations', function() {
    Flight::auth_middleware()->authorizeAnyRole([Roles::USER, Roles::ADMIN]);
    Flight::json(Flight::reservation_service()->getAllReservations());
});

// vraca jednu rezervaciju po ID-u
Flight::route('GET /reservations/@id', function($id) {
    Flight::auth_middleware()->authorizeAnyRole([Roles::USER, Roles::ADMIN]);
    Flight::json(Flight::reservation_service()->getReservationById($id));
});

// kreira novu rezervaciju
Flight::route('POST /reservations', function() {
    Flight::auth_middleware()->authorizeAnyRole([Roles::USER, Roles::ADMIN]);

    $data = Flight::request()->data->getData(); // uzimanje podataka iz zahtjeva
    $user = Flight::get('user'); // korisnik iz tokena

    // dodavanje user_id u rezervaciju
    $data['user_id'] = $user->id;

    Flight::json(Flight::reservation_service()->createReservation($data));
});

// azurira rezervaciju po ID-u
Flight::route('PUT /reservations/@id', function($id) {
    Flight::auth_middleware()->authorizeAnyRole([Roles::USER, Roles::ADMIN]);
    $data = Flight::request()->data->getData();
    Flight::json(Flight::reservation_service()->updateReservation($id, $data));
});

// brise rezervaciju po ID-u
Flight::route('DELETE /reservations/@id', function($id) {
    Flight::auth_middleware()->authorizeAnyRole([Roles::USER, Roles::ADMIN]);
    Flight::json(Flight::reservation_service()->deleteReservation($id));
});
