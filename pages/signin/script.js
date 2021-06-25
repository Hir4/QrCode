$(document).ready(() => {
  $("#signin-button").on("click", function () {
    let user = $("#user").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let confirmepassword = $("#confirmepassword").val();

    if (user && email && password && confirmepassword) {
      $.ajax({
        url: "/signinuser",
        type: "POST",
        data: { user: user, email: email, password: password, confirmepassword: confirmepassword },
        success: function (data) {
          if(data.includes("/") === true){
            window.location.replace(`${data}`)
            $("#signin-button").css("background-color", "#02DDF9");
          }else{
            $("#user").val(data);
            $("#email").val(data);
            $("#password").val(data);
            $("#confirmepassword").val(data);
            $("#signin-button").css("background-color", "red");
          }
        }
      });
    }
  })
});