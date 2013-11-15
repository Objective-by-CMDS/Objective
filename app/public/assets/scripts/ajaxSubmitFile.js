$(document).ready(function() {
  if($('#userPhotoInput').val() === '') {
    $('#saveAjax').attr('disabled', 'disabled');
  }
  $('#userPhotoInput').on('change', function() {
    $('#fileselecttext').text(this.value.split(/[\/\\]/).pop());
    $('.fileinputcontainer').height('200px');
    $('#saveAjax').removeAttr('disabled');

    $('#uploadForm').ajaxSubmit({
      url: '/settings',
      success: function(response) {
        console.log("SUCCESS UPLOADING TEMP FILE BEFORE ERROR REPORTING");
        if(response.error) {
          console.log("ERROR UPLOADING");
            $('.fileinputcontainer').append($("<h5 style='color: red; text-align: center; padding: 1%;'>" + response.error + "</h5>"));
          return;
        }
        var imageUrlOnServer = response.path;
        var node = '<img class="uploadedPhoto" src="' + imageUrlOnServer + '"/>';
        $('.fileinputcontainer').append($(node));
      }
    });
  });

  $('#saveAjax').on('click', function() {
    $.ajax({
      url: '/settings/save',
      type: 'POST',
      //Ajax events
      // beforeSend: beforeSendHandler,
      success: function(response) {
        $(this).attr('value', "Saved");
        $(this).css('background', '#57ff90');
        $('.userpic').attr('src', response.path);
        $('.uploadedPhoto').remove();
        $('.fileinputcontainer').height('auto');
        $('#fileselecttext').text("Uploaded photo!");
      },
      // error: errorHandler,
      // Form data
      data: {pathToFile: $('.uploadedPhoto').attr('src')}
    });
  });
});