$(document).ready(() => {
  var typeNumber = 4;
  var errorCorrectionLevel = 'L';
  var qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData('Hi!');
  qr.make();
  $("#placeHolder").html(qr.createImgTag());

  $("#logout-button").on("click", function () {
    window.location.replace("/");
  });

  $("#ticket-button").on("click", function () {
    $("#textareawrite").css('display', 'flex');
  });

  $("#cancel-ticket").on("click", function () {
    $("#textareawrite").css('display', 'none');
  });

  $("#send-ticket").on("click", function () {
    let ticketContent = $("#ticket-content").val();
    $.ajax({
      url: "/ticket",
      type: "POST",
      data: { ticketContent: ticketContent },
      success: function (data) {
        if (data.includes("/") === true) {
          window.location.replace(`${data}`)
          return true;
        }
        const newData = [data[data.length - 1]];
        newData.map(dataContent => {
          $("#ticket").append(
            ` <div class="write-ticket">
            <span class="content-ticket">${dataContent.content}</span>
            <span class="content-ticket" id="writer-name">${dataContent.owner}</span>
          </div>`
          );
        });
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
      if (data.includes("/") === true) {
        window.location.replace(`${data}`);
        return true;
      }
      $("#personal-text").html(`Deixe um bilhete ${data[0].owner}`);
      data.map(dataContent => {
        $("#ticket").append(
          ` <div class="write-ticket">
          <span class="content-ticket">${dataContent.content}</span>
          <span class="content-ticket" id="writer-name">${dataContent.owner}</span>
        </div>`
        )
      })
    }
  });
});

