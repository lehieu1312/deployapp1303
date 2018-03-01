$(document).ready(function() {
    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function validateForm_send_mail() {
        var check;
        var checkmail = validateEmail($('#email').val());
        if ($('#email').val() == "") {
            $('#email').attr('placeholder', 'Email can not be empty');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            // $('#icon-err-email').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkmail == false) {
            $('#email').val('');
            $('#email').attr('placeholder', 'Email invalid');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            // $('#icon-err-email').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#email').removeClass('input-holder').removeClass('border-bottom-red');
            // $('#icon-err-email').removeClass('display-inline').addClass('display-none');
        }
        if (check == false)
            return false;
        else
            return true;
    }

    // function send_ajax_send_mail() {
    $('#btn-send-mail').click(function() {

        if (validateForm_send_mail() == false)
            return
        $('#loading').show();
        $.ajax({
            url: "/success-mail",
            type: "POST",
            data: {
                email: $('#email').val(),
                cKeyFolder: $('#cKey').val(),
            },
            success: function(result) {
                // alert(result.status);
                if (result.status == 1) {
                    $('#email').val('');
                    $('.successPopup').show();
                    // $('.alert-upload').html(result.content[0]['msg']);
                    $("#success-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        $("#success-alert").slideUp(1000);
                        $('.successPopup').hide();
                    });
                    // location.href = "/success/" + result.keyID
                } else if (result.status == 2) {

                    $('.errPopup').show();
                    $('.alert-upload').html(result.content[0]['msg']);
                    $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        $("#danger-alert").slideUp(1000);
                        $('.errPopup').hide();
                    });
                } else if (result.status == 3) {
                    $('.errPopup').show();
                    $('.alert-upload').html(result.content);
                    $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        $("#danger-alert").slideUp(1000);
                        $('.errPopup').hide();
                    });
                } else {
                    alert(result);
                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                    $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        $("#danger-alert").slideUp(1000);
                        $('.errPopup').hide();
                    });
                }
            },
            error: function(jqXHR, exception) {
                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                    $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        $("#danger-alert").slideUp(1000);
                        $('.errPopup').hide();
                    });
                }
                // timeout: 300000
        }).always(function(data) {
            // alert('--' + JSON.stringify(data));
            $('#loading').hide();
            // alert(data);
        });
    })
});