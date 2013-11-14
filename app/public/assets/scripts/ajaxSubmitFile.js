$(document).ready(function() {
  $('.fileinputinvis').on('change', function() {
    $('#fileselecttext').text(this.value.split(/[\/\\]/).pop());
    $('.fileinputcontainer').height('200px');
  });
  var timerId;
  timerId = setInterval(function() {
    if($('#userPhotoInput').val() !== '') {
      clearInterval(timerId);
      $('#uploadForm').submit();
    }
  }, 500);
  $('form').submit(function() {
    $(this).ajaxSubmit({
      success: function(response) {
        console.log("SUCCESS UPLOADING BEFORE ERROR REPORTING");
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
    return false;
  });
});