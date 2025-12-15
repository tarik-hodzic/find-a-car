<?php
require_once __DIR__ . '/../services/SubscriptionService.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

$auth = new AuthMiddleware();

// ==================== ADMIN RUTE ====================

// vraca sve dostupne pretplate koje su TEMPLATE (is_template = 1)
Flight::route('GET /api/subscriptions', function() use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->getTemplateSubscriptions());
});

// vraca jednu pretplatu po ID-u (admin vidi samo templates)
Flight::route('GET /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->getSubscriptionById($id));
});

// dodavanje nove template pretplate (koristi admin dashboard)
Flight::route('POST /api/subscriptions', function() use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData();
    $service = new SubscriptionService();
    Flight::json($service->createSubscription($data));
});

// azuriranje postojece template pretplate
Flight::route('PUT /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $data = Flight::request()->data->getData();
    $service = new SubscriptionService();
    Flight::json($service->updateSubscription($id, $data));
});

// brisanje pretplate (samo admin)
Flight::route('DELETE /api/subscriptions/@id', function($id) use ($auth) {
    $auth->verifyToken();
    $auth->authorizeRole("admin");

    $service = new SubscriptionService();
    Flight::json($service->deleteSubscription($id));
});

// ==================== KORISNICKE RUTE ====================

// vraca sve dostupne template planove (za dropdown)
Flight::route('GET /subscriptions/available', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);
    Flight::json(Flight::subscription_service()->getTemplateSubscriptions());
});

// korisnik kupuje plan (kreira se nova pretplata sa user_id i datume)
Flight::route('POST /subscriptions/subscribe', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);

    $data = Flight::request()->data->getData();
    $user = Flight::get('user');
    $data['user_id'] = $user->id;
    $data['subscribed_at'] = date("Y-m-d");

    // ako datumi nisu poslani sa frontenda, izracunaj ih
    if (!isset($data['start_date']) || !isset($data['end_date'])) {
        $billing = $data['billing'] ?? 'monthly';
        $data['start_date'] = date("Y-m-d");
        $data['end_date'] = $billing === 'yearly'
            ? date("Y-m-d", strtotime("+1 year"))
            : date("Y-m-d", strtotime("+1 month"));
    }

    $data['is_template'] = 0;

    Flight::json(Flight::subscription_service()->createSubscription($data));
});

/*// provjera da li korisnik vec ima aktivnu pretplatu
Flight::route('GET /subscriptions/active', function () {
    Flight::auth_middleware()->authorizeAnyRole(["user", "admin"]);
    $user = Flight::get('user');
    Flight::json(Flight::subscription_service()->getActiveSubscriptionForUser($user->id));
});*/
