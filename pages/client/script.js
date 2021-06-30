$(document).ready(() => {

  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

  $.ajax({
    url: "/ticket",
    type: "GET",
    data: {},
    success: function (data) {
      if (data === "/loginpage") {
        window.location.replace(`${data}`);
        return true;
      }
      for (let key in data) {
        $("#ticket").append(
          `  <div class="write-ticket" id="event-${data[key].eventName}">
          <span class="content-ticket">${data[key].eventName}</span>
          <span class="content-ticket" >${data[key].eventDescription}</span>
          <span class="content-ticket">${data[key].eventDate}</span>
          <span class="content-ticket" >${data[key].eventPlace}</span>
          <button type="button" class="join-event" name="${data[key].eventName}" >Buy</button>
        </div>`
        )
      }
    }
  });

  $(document).on('click', '.join-event', function () {
    console.log("funfa");
    const eventName = $(this).attr("name");
    console.log(eventName);
    $(`#event-${eventName}`).remove();
    $.ajax({
      url: "/joinEvent",
      type: "POST",
      data: {eventName: eventName},
      success: function () {
      }
    });
  });

  $("#bought-event-button").on("click", function () {
    window.location.replace("/store");
  })

});

