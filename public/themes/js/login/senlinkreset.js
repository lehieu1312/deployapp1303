$(document).ready(() => {
    $('#myModal').modal('hide');
    $('.errPopup').show();
    $('.alert-upload').text("You link is expired. You have to repeat the actication process.");
    $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
        $("#danger-alert").slideUp(1000);
        $('.errPopup').hide();
    });
});
