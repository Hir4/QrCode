$(document).ready(() => {
  $("#login-button").on("click", function () {
    let user = $("#user").val();
    let password = $("#password").val();

    if (user && password) {
      $.ajax({
        url: "/login",
        type: "POST",
        data: { user: user, password: password},
        success: function (data) {
          window.location.replace(`${data}`);
        }
      });
    }
  })
});



