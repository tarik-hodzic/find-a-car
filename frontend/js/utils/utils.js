// ako utils nije vec definisan, definisi ga
if (typeof Utils === "undefined") {
  var Utils = {
    // inicijalizacija data table
    datatable: function (table_id, columns, data, pageLength = 15) {
      // ako tabela vec postoji, unisti je
      if ($.fn.dataTable.isDataTable("#" + table_id)) {
        $("#" + table_id).DataTable().destroy();
      }
      // napravi novu data table
      $("#" + table_id).DataTable({
        data: data,
        columns: columns,
        pageLength: pageLength,
        lengthMenu: [2, 5, 10, 15, 25, 50, 100, "All"]
      });
    },

    // dekodiranje jwt tokena
    parseJwt: function (token) {
      if (!token) return null;
      try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
      } catch (e) {
        console.error("invalid token:", e);
        return null;
      }
    }
  };
}
