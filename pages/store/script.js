$(document).ready(() => {

  $("#logout-button").on("click", function () {
    window.location.replace("/loginpage");
  });

  $("#more-event-button").on("click", function () {
    window.location.replace("/client");
  });

  $("#back-page").on("click", function () {
    $("#event-info-area").css('display', 'none');
  });

  $.ajax({
    url: "/eventboughtcards",
    type: "GET",
    data: {},
    success: function (data) {
      // if (data === "/loginpage") {
      //   window.location.replace(`${data}`);
      //   return true;
      // }
      for (let key in data) {
        $("#ticket").append(
          `  <div class="write-ticket" id="event-${data[key].eventName}" name="${data[key].eventName}">
            <span class="content-ticket">${data[key].eventName}</span>
            <span class="content-ticket" >${data[key].eventDescription}</span>
            <span class="content-ticket">${data[key].eventDate}</span>
            <span class="content-ticket">${data[key].eventPlace}</span>
            <button class="show-qrcode-button" name="${data[key].eventName}">QRCode</button>
            <button class="cancel-event-button" name="${data[key].eventName}">Cancel purchase</button>
          </div>`
        )
      }
    }
  });

  $(document).on('click', '.show-qrcode-button', function () {
    const eventName = $(this).attr("name");
    $("#event-info-area").css('display', 'flex');
    $.ajax({
      url: "/sendeventboughtcards",
      type: "POST",
      data: { eventName: eventName },
      success: function (data) {
        // if (data === "/loginpage") {
        //   window.location.replace(`${data}`);
        //   return true;
        // }
        var typeNumber = 0;
        var errorCorrectionLevel = 'L';
        var qr = qrcode(typeNumber, errorCorrectionLevel);
        // qr.addData(`https://www.alphaedtech.org.br`);
        qr.addData(`http://localhost:8080/confirm/?user=${data}&event=${eventName}`);
        qr.make();
        $("#placeHolder").html(qr.createImgTag());
      }
    });
  });

  $(document).on('click', '.cancel-event-button', function () {
    const eventName = $(this).attr("name");
    $(`#event-${eventName}`).remove();

    $.ajax({
      url: "/cancelevent",
      type: "POST",
      data: { eventName: eventName },
      success: function (data) {
        if (data === "/loginpage") {
          window.location.replace(`${data}`);
          return true;
        }
      }
    });
  });

});

