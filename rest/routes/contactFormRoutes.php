<?php
require_once __DIR__ . '/../services/ContactFormService.php';

// vraca sve kontakt forme iz baze
Flight::route('GET /api/contact', function() {
    $service = new ContactFormService();
    Flight::json($service->getAllContacts());
});

// vraca jednu kontakt poruku po ID-u
Flight::route('GET /api/contact/@id', function($id) {
    $service = new ContactFormService();
    Flight::json($service->getContactById($id));
});

// kreira novu kontakt poruku (samo ako je korisnik loginovan)
Flight::route('POST /api/contact', function() {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]); // provjera da li je korisnik loginovan

    $data = Flight::request()->data->getData(); // uzimanje podataka iz forme
    $user = Flight::get('user'); // korisnik iz tokena
    $data['user_id'] = $user->id; // dodajemo njegov ID u poruku

    $service = new ContactFormService();
    Flight::json($service->createContact($data)); // saljemo na servis
});

// azurira postojecu kontakt poruku (npr. status)
Flight::route('PUT /api/contact/@id', function($id) {
    $data = Flight::request()->data->getData();
    $service = new ContactFormService();
    Flight::json($service->updateContact($id, $data));
});

// brise kontakt poruku iz baze po ID-u
Flight::route('DELETE /api/contact/@id', function($id) {
    $service = new ContactFormService();
    Flight::json($service->deleteContact($id));
});
