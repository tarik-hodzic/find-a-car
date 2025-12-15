// admin.js - spa kompatibilan admin panel sa token validacijom

// inicijalna provjera za globalne varijable za brisanje
if (typeof window.currentDeleteType === "undefined") {
  window.currentDeleteType = null;
  window.currentDeleteId = null;
}

// pokretanje admin panela, provjera tokena i role
function initAdmin() {
  console.log("admin spa section loaded");

  const token = localStorage.getItem("user_token");

  if (!token || token === "undefined") {
    toastr.error("morate biti prijavljeni");
    window.location.href = "index.html";
    return;
  }

  const user = Utils.parseJwt(token)?.user;

  if (!user || user.role !== Constants.ADMIN_ROLE) {
    toastr.error("pristup dozvoljen samo administratorima");
    window.location.href = "index.html";
    return;
  }

  fetchCars();
  fetchSubscriptions();
}

// =============== CARS ====================

// ucitavanje liste auta iz baze
function fetchCars() {
  RestClient.get("api/cars", function (data) {
    if (!Array.isArray(data)) {
      console.error("fetchCars: expected array, got:", data);
      toastr.error("neuspjesno ucitavanje auta");
      return;
    }

    let table = "";
    data.forEach(car => {
      table += `
        <tr>
          <td>${car.id}</td>
          <td><img src="${car.image}" width="50"></td>
          <td>${car.brand} ${car.model}</td>
          <td>${car.year}</td>
          <td>$${car.price_per_day}</td>
          <td>${car.availability === 1 ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editCar(${car.id})">Change</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('car', ${car.id})">Delete</button>
          </td>
        </tr>`;
    });
    $("#carTable").html(table);
  });
}

// dodavanje novog auta u bazu
function addCar() {
  const car = {
    brand: $("#carBrand").val(),
    model: $("#modelTest123").val(),
    year: $("#carYear").val(),
    price_per_day: $("#carPrice").val(),
    availability: 1,
    image: $("#carImage").val(),
    is_special: $("#carIsSpecial").is(":checked") ? 1 : 0,
    description: $("#carDescription").val()
  };

  RestClient.post("api/cars", car, function () {
    toastr.success("car added");
    fetchCars();
    $("#addCarModal").modal("hide");
  });
}

// otvaranje forme za izmjenu auta
function editCar(id) {
  RestClient.get(`api/cars/${id}`, function (car) {
    $("#editCarId").val(car.id);
    $("#editCarBrand").val(car.brand);
    $("#editCarModel").val(car.model);
    $("#editCarYear").val(car.year);
    $("#editCarPrice").val(car.price_per_day);
    $("#editCarImage").val(car.image);
    $("#editCarAvailability").val(car.availability);
    $("#editCarIsSpecial").prop("checked", car.is_special === 1);
    $("#editCarDescription").val(car.description || "");
    $("#editCarModal").modal("show");
  });
}

// spremanje izmjena za auto
function saveCarChanges() {
  const id = $("#editCarId").val();
  const car = {
    brand: $("#editCarBrand").val(),
    model: $("#editCarModel").val(),
    year: $("#editCarYear").val(),
    price_per_day: $("#editCarPrice").val(),
    image: $("#editCarImage").val(),
    availability: $("#editCarAvailability").val(),
    is_special: $("#editCarIsSpecial").is(":checked") ? 1 : 0,
    description: $("#editCarDescription").val()
  };
  RestClient.put(`api/cars/${id}`, car, function () {
    toastr.success("Car updated");
    fetchCars();
    $("#editCarModal").modal("hide");
  });
}

// =============== SUBSCRIPTIONS ====================

// ucitavanje svih subskripcija
function fetchSubscriptions() {
  RestClient.get("api/subscriptions", function (data) {
    if (!Array.isArray(data)) {
      console.error("fetchSubscriptions: expected array, got:", data);
      toastr.error("neuspjesno ucitavanje pretplata");
      return;
    }

    let table = "";
    data.forEach(sub => {
      table += `
        <tr>
          <td>${sub.id}</td>
          <td>${sub.plan}</td>
          <td>$${sub.price}</td>
          <td>${sub.description || '-'}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editSubscription(${sub.id})">Change</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('subscription', ${sub.id})">Delete</button>
          </td>
        </tr>`;
    });

    $("#subscriptionTable").html(table);

    // aktiviranje bootstrap tooltipova ako postoje
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });
}

// dodavanje nove subskripcije
function addSubscription() {
  const sub = {
    plan: $("#subName").val(),
    price: $("#subPriceM").val(),
    description: $("#subDescription").val(),
    user_id: 1
  };
  RestClient.post("api/subscriptions", sub, function () {
    toastr.success("subscription added");
    fetchSubscriptions();

    const modal = bootstrap.Modal.getInstance(document.getElementById("addSubscriptionModal"));
    if (modal) modal.hide();

    setTimeout(() => {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0";
      document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
    }, 300);
  });
}

// prikaz detalja i edit subskripcije
function editSubscription(id) {
  RestClient.get(`api/subscriptions/${id}`, function (sub) {
    $("#editSubId").val(sub.id);
    $("#editSubName").val(sub.plan);
    $("#editSubPriceM").val(sub.price);
    $("#editSubDescription").val(sub.description);
    $("#editSubscriptionModal").modal("show");
  });
}

// spremanje izmjena subskripcije
function saveSubscriptionChanges() {
  const id = $("#editSubId").val();
  const sub = {
    plan: $("#editSubName").val(),
    price: $("#editSubPriceM").val(),
    description: $("#editSubDescription").val()
  };
  RestClient.put(`api/subscriptions/${id}`, sub, function () {
    toastr.success("subscription updated");
    fetchSubscriptions();
    $("#editSubscriptionModal").modal("hide");
  });
}

// =============== DELETE ====================

// prikaz modala za potvrdu brisanja
function confirmDelete(type, id) {
  currentDeleteType = type;
  currentDeleteId = id;
  $("#deleteConfirmationModal").modal("show");
}

// izvrsavanje brisanja
$(document).on("click", "#confirmDeleteButton", function () {
  let url = "";
  if (currentDeleteType === "car") url = `api/cars/${currentDeleteId}`;
  if (currentDeleteType === "subscription") url = `api/subscriptions/${currentDeleteId}`;

  RestClient.delete(url, null, function () {
    toastr.success("Deleted successfully");
    if (currentDeleteType === "car") fetchCars();
    if (currentDeleteType === "subscription") fetchSubscriptions();
    $("#deleteConfirmationModal").modal("hide");
  });
});

// obrada zatvaranja modala da se resetuje body
$(document).on('hidden.bs.modal', function () {
  document.body.style.overflow = 'auto';
  document.body.classList.remove('modal-open');
  $('.modal-backdrop').remove();
});

// =============== SPECIAL CARS ====================

// dodavanje special auta
function addSpecialCar() {
  const car = {
    brand: $("#specialCarBrand").val(),
    model: $("#specialCarModel").val(),
    year: $("#specialCarYear").val(),
    price_per_day: $("#specialCarPrice").val(),
    availability: 1,
    image: $("#specialCarImage").val(),
    is_special: 1,
    description: $("#specialCarDescription").val()
  };

  RestClient.post("api/cars", car, function () {
    toastr.success("special car added");
    fetchSpecialCars();
    $("#addSpecialCarModal").modal("hide");
  });
}

// izmjena special auta (ponovo koristi modal od auta)
function editSpecialCar(id) {
  RestClient.get(`api/cars/${id}`, function (car) {
    $("#editCarId").val(car.id);
    $("#editCarBrand").val(car.brand);
    $("#editCarModel").val(car.model);
    $("#editCarYear").val(car.year);
    $("#editCarPrice").val(car.price_per_day);
    $("#editCarImage").val(car.image);
    $("#editCarAvailability").val(car.availability);
    $("#editCarModal").modal("show");
  });
}

// dodavanje podrške za brisanje special auta
$(document).on("click", "#confirmDeleteButton", function () {
  let url = "";
  if (currentDeleteType === "car") url = `api/cars/${currentDeleteId}`;
  if (currentDeleteType === "subscription") url = `api/subscriptions/${currentDeleteId}`;
  if (currentDeleteType === "special") url = `api/cars/${currentDeleteId}`;

  RestClient.delete(url, null, function () {
    toastr.success("deleted successfully");
    if (currentDeleteType === "car") fetchCars();
    if (currentDeleteType === "subscription") fetchSubscriptions();
    if (currentDeleteType === "special") fetchSpecialCars();
    $("#deleteConfirmationModal").modal("hide");
  });
});
