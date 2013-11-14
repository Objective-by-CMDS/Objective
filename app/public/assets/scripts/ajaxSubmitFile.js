$(document).ready(function() {
  if($('#userPhotoInput').val() === '') {
    $('#saveAjax').attr('disabled', 'disabled');
  }
  $('#userPhotoInput').on('change', function() {
    $('#fileselecttext').text(this.value.split(/[\/\\]/).pop());
    $('.fileinputcontainer').height('200px');
    $('#saveAjax').removeAttr('disabled');

    $('#uploadForm').ajaxSubmit({
      url: 'http://localhost:8000/settings',
      success: function(response) {
        console.log("SUCCESS UPLOADING TEMP FILE BEFORE ERROR REPORTING");
        if(response.error) {
          console.log("ERROR UPLOADING");
            $('.fileinputcontainer').append($("<h5 style='color: red; text-align: center; padding: 1%;'>" + response.error + "</h5>"));
          return;
        }
        var imageUrlOnServer = response.path;
        console.log("Path: " + imageUrlOnServer);
        var node = '<img class="uploadedPhoto" src="' + imageUrlOnServer + '"/>';
        $('.fileinputcontainer').append($(node));
      }
    });
  });

  $('#saveAjax').on('click', function() {
    $.ajax({
      url: 'http://localhost:8000/settings/save',
      type: 'POST',
      //Ajax events
      // beforeSend: beforeSendHandler,
      success: console.log("Successfully send oldData"),
      // error: errorHandler,
      // Form data
      data: {pathToFile: $('.uploadedPhoto').attr('src')}
    });
  });
});