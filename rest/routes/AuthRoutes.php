<?php

// grupa ruta koje se odnose na autentifikaciju (npr. /auth/register, /auth/login)
Flight::group('/auth', function () {

    // ruta za registraciju novog korisnika
    Flight::route('POST /register', function () {
        $data = Flight::request()->data->getData(); // dobavi podatke iz POST zahtjeva

        $response = Flight::auth_service()->register($data); // pozovi servis za registraciju

        // ako je registracija uspješna, vrati OK odgovor sa podacima
        if ($response['success']) {
            Flight::json([
                'message' => 'Registered',
                'data' => $response['data']
            ]);
        } else {
            // ako ne, prekini s greškom
            Flight::halt(400, $response['error']);
        }
    });

    // ruta za login korisnika
    Flight::route('POST /login', function () {
        $data = Flight::request()->data->getData(); // dobavi podatke iz POST zahtjeva

        $response = Flight::auth_service()->login($data); // pozovi servis za login

        // ako je login uspješan, vrati token i podatke
        if ($response['success']) {
            Flight::json([
                'message' => 'Logged in',
                'data' => $response['data']
            ]);
        } else {
            // ako ne, vrati 401 gresku
            Flight::halt(401, $response['error']);
        }
    });

});
