$(document).ready(() => {
  $.ajax({
    url: "/valid",
    type: "POST",
    data: {},
    success: function (data) {
      if (data === "/loginpage") {
        window.location.replace(`${data}`);
        return true;
      }
      $("#ticket").append(`
        <div class="write-ticket" id="event-guests">
          <span class="content-ticket">${data.eventName}</span>
          <p>Total Guests</p>
          <span class="content-ticket">${data.guestsTotal}</span>
          <p>Guests Arrived</p>
          <span class="content-ticket">${data.guestsArrived}</span>
          <p>Guests Expected</p>
          <span class="content-ticket">${data.guestsExpected}</span>
        </div>`
      );
    }
  });
  $("#back-button").on("click", function () {
    window.location.replace("/admin");
  });

  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

});

