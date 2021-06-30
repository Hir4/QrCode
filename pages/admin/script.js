$(document).ready(() => {
  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

  $("#ticket-button").on("click", function () {
    $("#textareawrite").css('display', 'flex');
  });

  $("#cancel-ticket").on("click", function () {
    $("#textareawrite").css('display', 'none');
  });

  $("#send-ticket").on("click", function () {
    let eventCode = $("#event-name").val();
    let eventName = $("#event-name").val();
    let eventDescription = $("#event-description").val();
    let eventDate = $("#event-date").val();
    let eventPlace = $("#event-place").val();

    $.ajax({
      url: "/ticket",
      type: "POST",
      data: { eventCode: eventCode, eventName: eventName, eventDescription: eventDescription, eventDate: eventDate, eventPlace: eventPlace },
      success: function (data) {
        if (data === "/loginpage") {
          window.location.replace(`${data}`);
          return true;
        }
        $("#ticket").append(
          ` 
          <div class="write-ticket" id="event-${data.eventName}">
            <span class="content-ticket" >${data.eventName}</span>
            <span class="content-ticket" >${data.eventDescription}</span>
            <span class="content-ticket">${data.eventDate}</span>
            <span class="content-ticket" >${data.eventPlace}</span>
          </div>`
        );
        $("#ticket-content").val("");
        $("#textareawrite").css('display', 'none');
      }
    });
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
          <span class="content-ticket" >${data[key].eventName}</span>
          <span class="content-ticket">${data[key].eventDescription}</span>
          <span class="content-ticket">${data[key].eventDate}</span>
          <span class="content-ticket" >${data[key].eventPlace}</span>
        </div>`
        )
      }
    }
  });
});

