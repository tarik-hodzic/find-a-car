if (typeof Constants === "undefined") {
  var Constants = {
    PROJECT_BASE_URL: location.hostname === "localhost"
      ? "http://localhost/TarikHodzic/Introduction-To-Web-Programming/FindACar/rest/"
      : "https://monkfish-app-c7lnc.ondigitalocean.app/rest/",
    ADMIN_ROLE: "admin",
    USER_ROLE: "user"
  };
}
