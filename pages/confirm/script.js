$(document).ready(() => {
  function mask() {
    $(".docId").mask('000.000.000-00');
  }

  $.ajax({
    url: "/confirm",
    type: "POST",
    data: {},
    success: function (data) {
      if (data === "/invalid") {
        window.location.replace(`${data}`);
        return true;
      }
      $("#ticket").append(`
        <div class="write-ticket" id="event-${data.eventName}">
          <span class="content-ticket data-client">${data.eventName}</span>
          <span class="content-ticket">${data.eventDate}</span>
          <span class="content-ticket">${data.eventPlace}</span>
          <span class="content-ticket data-client">${data.clientName}</span>
          <span class="content-ticket data-client docId" >ID: ${data.clientId}</span>
          <span class="content-ticket">Ticket <span id="valid">VALID</span></span>
        </div>`
      );
    }
  });

  mask();
  $(".docId").mask('0.000-00');
  $("#send-ticket").on("click", function () {
    window.location.replace("/valid");
  });

  $("#cancel-ticket").on("click", function () {
    window.location.replace("/admin");
  });

  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

});

