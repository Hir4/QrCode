$(document).ready(() => {
  $("#cpf").keypress(function () {
    $(this).mask('000.000.000-00');
    $("#error_text").hide();
  });

  $("#signin-button").on("click", function () {

    let cleanCpf = $("#cpf").val().split('.').join("");
    cleanCpf = cleanCpf.split('-').join("");

    let user = $("#user").val();
    let name = $("#name").val();
    let email = $("#email").val();
    let password = $("#password").val();
    let confirmpassword = $("#confirmpassword").val();

    if (password === confirmpassword) {

      if (user && name && email && password) {
        $.ajax({
          url: "/signinuser",
          type: "POST",
          data: { user: user, name: name, cpf: cleanCpf, email: email, password: password, confirmpassword: confirmpassword },
          success: function (data) {
            if (data === "/loginpage") {
              window.location.replace(`${data}`);
              $("#signin-button").css("background-color", "#02DDF9");
            }
          }
        });
      }
    } else {
      $("#user").val(user);
      $("#name").val(name);
      $("#cpf").val(cpf);
      $("#email").val(email);
      $("#password").val();
      $("#confirmpassword").val();
      $("#signin-button").css("background-color", "red");
      $("#err-msg").html("Senha não confere. Favor tentar novamente.")
    }

  })
});