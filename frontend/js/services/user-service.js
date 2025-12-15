var isRegisterMode = false;

var UserService = {
  init: function () {
    const token = localStorage.getItem("user_token");
    const user = Utils.parseJwt(token)?.user;

    // podesavanje navigacije na osnovu prijave
    if (user) {
      $("#login-buttons").addClass("d-none");
      $("#logout-button").removeClass("d-none");

      if (user.role === Constants.ADMIN_ROLE) {
        $("#admin-link").removeClass("d-none");

        // ako admin sekcija nije vec dodana, dodaj je u SPA
        if ($("#spapp #admin").length === 0) {
          $("#spapp").append('<section id="admin" data-load="admin.html"></section>');
        }
      }

    } else {
      $("#login-buttons").removeClass("d-none");
      $("#logout-button").addClass("d-none");
      $("#admin-link").addClass("d-none");
    }

    // obrada forme za login i registraciju
$(document).on("submit", "#authForm", function (e) {
  e.preventDefault();

  const entity = {
    email: $("#auth-email").val(),
    password: $("#auth-password").val()
  };

  if (isRegisterMode) {
    const confirmPassword = $("#auth-confirm-password").val();

    // provjera da su lozinke iste
    if (entity.password !== confirmPassword) {
      toastr.error("Passwords do not match.");
      return;
    }

    entity.name = $("#auth-name").val();
    entity.role = "user";

    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/register",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      success: function () {
        toastr.success("Registered successfully. You can now login.");

        const modalElement = document.getElementById('authModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
      },
      error: function (xhr) {
        const msg = xhr?.responseJSON?.error || "Registration failed";
        toastr.error(msg);
      }
    });
  } else {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + "auth/login",
      type: "POST",
      data: JSON.stringify(entity),
      contentType: "application/json",
      success: function (res) {
        localStorage.setItem("user_token", res.data.token);

        const modalElement = document.getElementById('authModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();

        toastr.success("Login successful!");
        setTimeout(() => window.location.replace("index.html"), 500);
      },
      error: function (xhr) {
        const msg = xhr?.responseJSON?.error || "Login failed";
        toastr.error(msg);
      }
    });
  }
});


    // prelaz izmedju login i register moda
    $(document).on("click", "#toggleAuthMode", function (e) {
      e.preventDefault();
      isRegisterMode = !isRegisterMode;

      if (isRegisterMode) {
        $("#register-extra-fields").show();
        $("#authModalLabel").text("Register");
        $("#toggleAuthMode").text("Already have an account? Login");
      } else {
        $("#register-extra-fields").hide();
        $("#authModalLabel").text("Login");
        $("#toggleAuthMode").text("Don't have an account? Register");
      }
    });
  },

  logout: function () {
    // zatvori modal ako je otvoren
    const modalElement = document.getElementById('authModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }

    localStorage.clear();

    $("#login-buttons").removeClass("d-none");
    $("#logout-button").addClass("d-none");
    $("#admin-link").addClass("d-none");

    toastr.info("Logged out.");
    setTimeout(() => window.location.replace("index.html"), 800);
  }
};

// otvara modal i postavlja da li je login ili register mod
function openAuthModal(mode = 'login') {
  const modalElement = document.getElementById('authModal');
  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

  isRegisterMode = (mode === 'register');

  if (isRegisterMode) {
    $("#register-extra-fields").show();
    $("#authModalLabel").text("Register");
    $("#toggleAuthMode").text("Already have an account? Login");
  } else {
    $("#register-extra-fields").hide();
    $("#authModalLabel").text("Login");
    $("#toggleAuthMode").text("Don't have an account? Register");
  }
}
