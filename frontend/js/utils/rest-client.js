// ako restclient nije vec definisan, definisi ga
if (typeof RestClient === "undefined") {
  var RestClient = {
    // get metoda za dohvat podataka
    get: function (url, callback, error_callback) {
      const token = localStorage.getItem("user_token");
      $.ajax({
        url: Constants.PROJECT_BASE_URL + url,
        type: "GET",
        beforeSend: function (xhr) {
          if (token) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          }
        },
        success: callback,
        error: function (jqXHR) {
          if (error_callback) error_callback(jqXHR);
          else toastr.error(jqXHR.responseText || "get error");
        }
      });
    },

    // post metoda za slanje podataka
    post: function (url, data, callback, error_callback) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (response) {
          if (callback) callback(response);
        },
        error: function (jqXHR) {
          if (error_callback) error_callback(jqXHR);
          else toastr.error(jqXHR.responseText || "post error");
        }
      });
    },

    // put metoda za azuriranje podataka
    put: function (url, data, callback, error_callback) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + url,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (response) {
          if (callback) callback(response);
        },
        error: function (jqXHR) {
          if (error_callback) error_callback(jqXHR);
          else toastr.error(jqXHR.responseText || "put error");
        }
      });
    },

    // patch metoda za parcijalno azuriranje
    patch: function (url, data, callback, error_callback) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + url,
        type: "PATCH",
        data: JSON.stringify(data),
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (response) {
          if (callback) callback(response);
        },
        error: function (jqXHR) {
          if (error_callback) error_callback(jqXHR);
          else toastr.error(jqXHR.responseText || "patch error");
        }
      });
    },

    // delete metoda za brisanje podataka
    delete: function (url, data, callback, error_callback) {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + url,
        type: "DELETE",
        data: data ? JSON.stringify(data) : null,
        contentType: "application/json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("user_token"));
        },
        success: function (response) {
          if (callback) callback(response);
        },
        error: function (jqXHR) {
          if (error_callback) error_callback(jqXHR);
          else toastr.error(jqXHR.responseText || "delete error");
        }
      });
    }
  };
}
