<?php
require_once __DIR__ . '/../services/SubscriptionService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$auth = new AuthMiddleware();

// ✅ Admin dashboard – prikazuje samo template pretplate
Flight::route('GET /api/subscriptions', function() use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->getTemplateSubscriptions()); // SAMO is_template = 1
});

// ✅ Dohvatanje jedne pretplate po ID-u (admin)
Flight::route('GET /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->getSubscriptionById($id));
});

// ✅ Kreiranje nove template pretplate (admin)
Flight::route('POST /api/subscriptions', function() use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData();
    $service = new SubscriptionService();
    Flight::json($service->createSubscription($data));
});

// ✅ Update template pretplate (admin)
Flight::route('PUT /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData();
    $service = new SubscriptionService();
    Flight::json($service->updateSubscription($id, $data));
});

// ✅ Brisanje pretplate (admin)
Flight::route('DELETE /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->deleteSubscription($id));
});

// ✅ Javna ruta – svi korisnici vide sve svoje i globalne planove
Flight::route('GET /subscriptions/available', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);
    Flight::json(Flight::subscription_service()->getTemplateSubscriptions());
});


// ✅ Kupovina plana – dodaje novu korisničku pretplatu
Flight::route('POST /subscriptions/subscribe', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);

    $data = Flight::request()->data->getData();
$user = Flight::get('user');
$data['user_id'] = $user->id;
$data['subscribed_at'] = date("Y-m-d");

// Ako već nisu poslani datumi s frontenda, izračunaj ih
if (!isset($data['start_date']) || !isset($data['end_date'])) {
    $billing = $data['billing'] ?? 'monthly'; // ako ne postoji, default na monthly
    $data['start_date'] = date("Y-m-d");
    $data['end_date'] = $billing === 'yearly'
        ? date("Y-m-d", strtotime("+1 year"))
        : date("Y-m-d", strtotime("+1 month"));
}

    $data['is_template'] = 0;
Flight::json(Flight::subscription_service()->createSubscription($data));

});

Flight::route('GET /subscriptions/active', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);
    $user = Flight::get('user');
    Flight::json(Flight::subscription_service()->getActiveSubscriptionForUser($user->id));
});
