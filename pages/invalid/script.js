$(document).ready(() => {

  $("#back-button").on("click", function () {
    window.location.replace("/admin");
  });

  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

});

