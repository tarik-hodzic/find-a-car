$(document).ready(function () {
    // provjera da li je spapp ucitan
    if (typeof $.spapp !== "function") {
        console.error("ERROR: spapp.js nije ispravno ucitan!");
        return;
    }

    // kreiranje spa aplikacije
    var app = $.spapp({ defaultView: "home", pageNotFound: "home" });

    // ======================== ROUTES ========================
    
    // ruta za home
    app.route({
        view: "home",
        onReady: function () {
            initCarousel();

            // ako je oznaceno da se home treba refreshati
            if (sessionStorage.getItem("refresh_home") === "true") {
                loadAvailableCars();
                sessionStorage.removeItem("refresh_home"); // brisemo signal
            }
        }
    });

    // ruta za cars
    app.route({
        view: "cars",
        load: "cars.html",
        onReady: function () {
            loadSpecialCars();
        }
    });

    // ruta za subscription
    app.route({
        view: "subscription",
        load: "subscription.html",
        onReady: function () {
            initPricingToggle();
        }
    });

    // ruta za faq
    app.route({
        view: "faq",
        load: "faq.html",
        onReady: function () {
            initFAQ();
        }
    });

    // ruta za contact
    app.route({
        view: "contact",
        load: "contact.html",
        onReady: () => {}
    });

    // ruta za admin
    app.route({
        view: "admin",
        load: "admin.html",
        onReady: initAdmin
    });

    // pokretanje spa aplikacije
    app.run();

    // ======================== HASH LOGIKA ========================

    // kada se promijeni hash, prikazi samo aktivnu sekciju
    $(window).on("hashchange", function () {
        var id = location.hash.replace("#", "") || "home";

        $("main#spapp > section").hide(); // sakrij sve
        $("#" + id).show(); // prikazi samo aktivnu

        // sakrij home sadrzaj ako nisi na home
        if (id !== "home") {
            $("#home").hide();
        } else {
            $("#home").show();
        }
    });

    // pokreni hashchange odmah
    $(window).trigger("hashchange");
});

// ======================== PAGE CHANGE DETECTION ========================

document.addEventListener("spap-onpagechange", function (event) {
    console.log("🔄 Page changed to:", event.detail.page);
    
    // ako je stranica pricing, inicijalizuj dodatne funkcije
    if (event.detail.page === "pricing") {
        console.log("✅ Pricing page detected, initializing...");
        initPricingPage();
    }
});
