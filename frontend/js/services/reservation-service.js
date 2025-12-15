// globalna funkcija koja učitava dostupne automobile
function loadAvailableCars() {
    const token = localStorage.getItem("user_token");

    // provjera da li postoji select i da li je korisnik loginovan
    if ($("#carSelect").length && token) {
        RestClient.get("cars/available", function (cars) {
            let options = '<option selected disabled>Choose your car</option>';
            cars.forEach(car => {
                // svaki auto se dodaje kao opcija u dropdown
                options += `<option value="${car.id}" data-price="${car.price_per_day}" data-label="${car.brand} ${car.model}">
                    ${car.brand} ${car.model}
                </option>`;
            });
            $('#carSelect').html(options);
        });
    } else {
        // ako korisnik nije loginovan dropdown je onemogucen
        $('#carSelect').html('<option selected disabled>You must be logged in</option>');
    }
}

$(document).ready(function () {
    const token = localStorage.getItem("user_token");

    loadAvailableCars(); // učitavanje odmah po pokretanju

    // kada se promijeni izbor auta iz dropdowna
    $('#carSelect').on('change', function () {
        const selected = $('#carSelect option:selected');
        const price = selected.data('price');
        const model = selected.data('label');
        $('#pricePerDay').val(price + " €");
        $('#modalCarModel').text(model);
        updateReservationTotal();
    });

    // svaki put kad se promijene datumi izračunava se nova cijena
    $('#startDate, #endDate').on('change', updateReservationTotal);

    function updateReservationTotal() {
        const start = new Date($('#startDate').val());
        const end = new Date($('#endDate').val());
        const price = parseFloat($('#carSelect option:selected').data('price'));
        const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

        // prikaz ukupne cijene samo ako su podaci validni
        if (!isNaN(days) && !isNaN(price) && days > 0) {
            const total = (days * price).toFixed(2);
            $('#totalprice_reservation').val(total + " €");
            $('#modalTotalPrice').text(total + " €");
            $('#modalDates').text($('#startDate').val() + " do " + $('#endDate').val());
        } else {
            // reset ako nešto nije validno
            $('#totalprice_reservation').val("");
            $('#modalTotalPrice').text("");
            $('#modalDates').text("");
        }
    }

    // slanje forme za rezervaciju
    $('#paymentForm').on('submit', function (e) {
        e.preventDefault();

        const token = localStorage.getItem("user_token");
        const parsed = Utils.parseJwt(token);
        if (!parsed || !parsed.user) {
            toastr.error("You must be logged in!");
            return;
        }

        const startDate = new Date($('#startDate').val());
        const endDate = new Date($('#endDate').val());
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // validacija da su datumi u budućnosti
        if (startDate < today || endDate < today) {
            toastr.error("Please select future dates only.");
            return;
        }

        // validacija da je end date poslije start date
        if (endDate < startDate) {
            toastr.error("Datum završetka mora biti poslije datuma početka.");
            return;
        }

        // validacija kartice
        const cardNumber = $('#cardNumber').val().replace(/\s+/g, '');
        if (!/^\d{16}$/.test(cardNumber)) {
            toastr.error("Card number must be 16 digits.");
            return;
        }

        const expiry = $('#expiryDate').val();
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            toastr.error("Expiry must be in MM/YY format.");
            return;
        }

        const [expMonth, expYear] = expiry.split('/').map(Number);
        const now = new Date();
        const expDate = new Date(2000 + expYear, expMonth);
        if (isNaN(expDate) || expDate <= now) {
            toastr.error("The expiration date cannot be in the past.");
            return;
        }

        const cvc = $('#cvv').val();
        if (!/^\d{3}$/.test(cvc)) {
            toastr.error("CVC must be 3 digits.");
            return;
        }

        // kreiranje rezervacije
        const reservation = {
            car_id: $('#carSelect').val(),
            start_date: $('#startDate').val(),
            end_date: $('#endDate').val(),
            total_price: parseFloat($('#totalprice_reservation').val().replace(/[^\d.]/g, '')),
            card_number: cardNumber,
            expiry_date: expiry,
            cvc: cvc
        };

        // slanje rezervacije na backend
        RestClient.post("reservations", reservation, function () {
            toastr.success("Rezervacija uspješna!");
            $('#paymentModal').modal('hide');

            // reset modalnog prikaza
            setTimeout(() => {
                $('.modal-backdrop').remove();

                $('body').removeClass('modal-open');
                $('body').removeAttr('style');
                $('body').css({
                    overflow: 'auto',
                    position: 'static',
                    top: 'auto',
                    paddingRight: ''
                });

                $('html').removeAttr('style');
                $('html').css({
                    overflow: 'auto',
                    position: 'static'
                });

                $(window).scrollTop(0);
            }, 300);

            // reset forme i podataka
            $('#paymentForm')[0].reset();
            $('#startDate').val('');
            $('#endDate').val('');
            $('#totalprice_reservation').val('');
            $('#pricePerDay').val('');

            // ponovo ucitaj dostupne aute
            loadAvailableCars();
        }, function (err) {
            console.error(err);
            toastr.error("Greška pri rezervaciji.");
        });
    });
});
