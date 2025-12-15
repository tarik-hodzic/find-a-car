// ucitava sve specijalne automobile ako je korisnik prijavljen
function loadSpecialCars() {
  const token = localStorage.getItem("user_token");
  if (!token) {
    $("#carCardsContainer").html("<p class='text-center'>You must be logged in to see available cars.</p>");
    return;
  }

  // dobavlja sve automobile sa flagom is_special
  RestClient.get("api/cars/special/all", function (cars) {
    const specialCars = cars.filter(car => car.is_special == 1);

    if (specialCars.length === 0) {
      $("#carCardsContainer").html("<p class='text-center'>No special cars available right now.</p>");
      return;
    }

    let html = "";
    specialCars.forEach(car => {
      const isAvailable = car.availability == 1;

      // kartica za svaki auto sa dugmetom RENT NOW ako je dostupan
      html += `
        <div class="col-md-4 mb-4">
          <div class="car-card p-3 border rounded text-center">
            <img src="${car.image}" class="img-fluid mb-2" alt="${car.brand} ${car.model}">
            <h4>${car.brand} ${car.model}</h4>
            <p>${car.description || ''}</p>
            <p class="price"><strong>$${car.price_per_day}</strong> /Day</p>
            <button class="btn ${isAvailable ? 'btn-dark' : 'btn-secondary'}" 
                    ${isAvailable ? `onclick="openModalCars('${car.brand} ${car.model}', ${car.price_per_day})"` : 'disabled'}>
              ${isAvailable ? 'RENT NOW' : 'UNAVAILABLE'}
            </button>
          </div>
        </div>`;
    });

    $("#carCardsContainer").html(html);
  });
}

// otvara modal za rezervaciju kada se klikne na RENT NOW
function openModalCars(name, pricePerDay) {
  $("#specialModalCarName").text(name);
  $("#specialModalPricePerDay").text(pricePerDay);
  $("#specialModalTotalPrice").text("0");
  $("#specialRentDateFrom").val("");
  $("#specialRentDateTo").val("");
  $("#specialCardNumber").val("");
  $("#specialExpiryDate").val("");
  $("#specialCvc").val("");
  $("#rentSpecialModal").modal("show");

  // azurira cijenu u zavisnosti od odabranih datuma
  function updateTotal() {
    const from = new Date($("#specialRentDateFrom").val());
    const to = new Date($("#specialRentDateTo").val());
    if (from && to && to > from) {
      const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
      const total = days * pricePerDay;
      $("#specialModalTotalPrice").text(total);
    } else {
      $("#specialModalTotalPrice").text("0");
    }
  }

  $("#specialRentDateFrom, #specialRentDateTo").off("change").on("change", updateTotal);

  // potvrda rezervacije kada korisnik klikne na dugme
  $("#confirmSpecialReservationBtn").off("click").on("click", function () {
    const dateFrom = $("#specialRentDateFrom").val();
    const dateTo = $("#specialRentDateTo").val();
    const cardNumber = $("#specialCardNumber").val().replace(/\s+/g, '');
    const expiry = $("#specialExpiryDate").val();
    const cvc = $("#specialCvc").val();

    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24));
    const today = new Date();
    today.setHours(0, 0, 0, 0); // resetuj vrijeme

    // validacije unosa
    if (!dateFrom || !dateTo) {
      toastr.error("Please select valid dates.");
      return;
    }

    if (from < today) {
      toastr.error("You cannot select a past date.");
      return;
    }

    if (to <= from) {
      toastr.error("End date must be after start date.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      toastr.error("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toastr.error("Expiry must be in MM/YY format.");
      return;
    }
    const [expMonth, expYear] = expiry.split('/').map(Number);
    const now = new Date();
    const expDate = new Date(2000 + expYear, expMonth);
    if (isNaN(expDate) || expDate <= now) {
      toastr.error("Card is expired.");
      return;
    }
    if (!/^\d{3}$/.test(cvc)) {
      toastr.error("CVC must be 3 digits.");
      return;
    }

    // pronalazi auto iz baze prema nazivu
    RestClient.get("api/cars/special/all", function (cars) {
      const car = cars.find(c => `${c.brand} ${c.model}` === name && c.is_special == 1);
      if (!car) {
        toastr.error("Car not found.");
        return;
      }

      // kreira objekat za slanje rezervacije
      const reservation = {
        car_id: car.id,
        date_from: dateFrom,
        date_to: dateTo,
        total_price: days * pricePerDay,
        card_number: cardNumber,
        expiry_date: expiry,
        cvc: cvc
      };

      // salje rezervaciju na backend
      RestClient.post("reservations", reservation, function () {
        toastr.success("Reservation successful!");
        $("#rentSpecialModal").modal("hide");

        setTimeout(() => {
          loadSpecialCars();
        }, 500);
      });
    });
  });
}

// gleda da li se prikazala #cars sekcija i pokrece ucitavanje specijalnih auta
const observer = new MutationObserver(() => {
  const isCarsViewVisible = document.querySelector("#cars");
  if (isCarsViewVisible && isCarsViewVisible.offsetParent !== null) {
    console.log("detektovana cars sekcija, pokrecem loadSpecialCars()");
    loadSpecialCars();
    observer.disconnect();
  }
});

observer.observe(document.getElementById("spapp"), {
  childList: true,
  subtree: true
});
