$(document).ready(function() {
    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function checkCharSpecialTwo(str) {
        var regex = /[!@#$%^&*()~_`+\- =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function checkCharSpecialText(str) {
        var regex = /[!@#$%^&*()~`+\=\[\]{};':"\\|<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function checkCharSpecialAlias(str) {
        var regex = /[!@#$%^&*()~`+\ =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {

            return checkF = false;
        } else return true;
    }

    function validateForm_build_android() {
        // var checkmail = validateEmail($('#email').val());
        var check;
        // if ($('#email').val() == "") {
        //     $('#email').attr('placeholder', 'Email can not be empty ');
        //     $('#email').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else if (checkmail == false) {
        //     $('#email').val('');
        //     $('#email').attr('placeholder', 'Email invalid');
        //     $('#email').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else {
        //     $('#email').removeClass('input-holder').removeClass('border-bottom-red');
        //     $('#icon-err-email').removeClass('display-inline').addClass('display-none');
        // }
        if ($('#keystore').val() == "") {
            $('#keystore').attr('placeholder', 'Key Store Password can not be empty ');
            $('#keystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if ($('#keystore').val().length < 8) {
            $('#keystore').val('');
            $('#keystore').attr('placeholder', 'Key Store Password must be longer than 8 characters');
            $('#keystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#keystore').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-keystore').removeClass('display-inline').addClass('display-none');
        }
        if ($('#confirmkeystore').val() == "") {
            $('#confirmkeystore').attr('placeholder', 'Key Store Confirm Password can not be empty ');
            $('#confirmkeystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if ($('#confirmkeystore').val() != $('#keystore').val()) {
            $('#confirmkeystore').val('');
            $('#confirmkeystore').attr('placeholder', 'Key Store Confirm Password not match Key Store Password ');
            $('#confirmkeystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#confirmkeystore').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-confirmkeystore').removeClass('display-inline').addClass('display-none');
        }
        if ($('#CN').val() == "") {
            $('#CN').attr('placeholder', 'First and last name can not be empty ');
            $('#CN').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-CN').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#CN').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-CN').removeClass('display-inline').addClass('display-none');
        }
        if ($('#OU').val() == "") {
            $('#OU').attr('placeholder', 'Organizational unit can not be empty ');
            $('#OU').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-OU').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#OU').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-OU').removeClass('display-inline').addClass('display-none');
        }
        if ($('#O').val() == "") {
            $('#O').attr('placeholder', 'Organizational can not be empty ');
            $('#O').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-O').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#O').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-O').removeClass('display-inline').addClass('display-none');
        }
        if ($('#L').val() == "") {
            $('#L').attr('placeholder', 'City or location can not be empty ');
            $('#L').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialText($('#L').val()) == false) {
            $('#L').val('');
            $('#L').attr('placeholder', 'City or location is contain character special ');
            $('#L').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#L').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-L').removeClass('display-inline').addClass('display-none');
        }
        if ($('#ST').val() == "") {
            $('#ST').attr('placeholder', 'State or Province can not be empty ');
            $('#ST').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialText($('#ST').val()) == false) {
            $('#ST').val('');
            $('#ST').attr('placeholder', 'State or Province is contain character special ');
            $('#ST').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#ST').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-ST').removeClass('display-inline').addClass('display-none');
        }
        if ($('#C').val() == "") {
            $('#C').attr('placeholder', 'Two-letter country can not be empty ');
            $('#C').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialTwo($('#C').val()) == false) {
            $('#C').val('');
            $('#C').attr('placeholder', 'Two-letter is contain character special ');
            $('#C').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#C').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-C').removeClass('display-inline').addClass('display-none');
        }
        if ($('#alias').val() == "") {
            $('#alias').attr('placeholder', 'Alias name can not be empty ');
            $('#alias').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-none').addClass('display-inline');
            check = false;
        } else if (checkCharSpecialAlias($('#alias').val()) == false) {
            $('#alias').val('');
            $('#alias').attr('placeholder', 'Alias can only contain alphanumeric characters ([a-z], [A-Z], [0-9], _)');
            $('#alias').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            $('#alias').removeClass('input-holder').removeClass('border-bottom-red');
            $('#icon-err-alias').removeClass('display-inline').addClass('display-none');
        }
        if (check == false) {
            return false
        }
        return true;
    }

    $('#btn-deploy-android').click(function() {
        if (validateForm_build_android() == true) {
            $('#noti-text-password').html($('#keystore').val());
            $('#noti-text-CN').html($('#CN').val());
            $('#noti-text-OU').html($('#OU').val());
            $('#noti-text-O').html($('#O').val());
            $('#noti-text-L').html($('#L').val());
            $('#noti-text-ST').html($('#ST').val());
            $('#noti-text-C').html($('#C').val());
            $('#noti-text-Alias').html($('#alias').val());
            $('#dialog-noti-info-android').css('display', 'block');
            // var checkConfirm = confirm(' Password: ' + $('#keystore').val() + '\n First and last name: ' + $('#CN').val() + '\n Organizational unit: ' + $('#OU').val() + '\n Organizational: ' + $('#O').val() + ' \n City or location: ' + $('#L').val() + '\n State or Province: ' + $('#ST').val() + '\n Two-letter country: ' + $('#C').val() + ' \n Alias name: ' + $('#alias').val() + '\n');
            // if (checkConfirm == false) {
            //     return;
            // }
            // alert($('#keyID').val());
        }
    });
    $('#btn-ok-noti-success-android').click(function() {
        var obj = {};
        $('#dialog-noti-info-android').css('display', 'none');
        $('#loading').show();

        // $('.form-group').find('.help-block').html('');
        // $('.form-group').removeClass('has-error').addClass('has-success');
        // $(".spinner").fadeIn();
        $.ajax({
            url: "/build-android",
            type: "POST",
            data: {
                // email: $('#email').val(),
                keystore: $('#keystore').val(),
                confirmkeystore: $('#confirmkeystore').val(),
                CN: $('#CN').val(),
                OU: $('#OU').val(),
                O: $('#O').val(),
                L: $('#L').val(),
                ST: $('#ST').val(),
                C: $('#C').val(),
                alias: $('#alias').val(),
                cKeyFolder: $('#keyID').val(),
            },
            //  processData: false,
            //contentType: false,
            success: function(result) {

                // $('#loading').text(result);
                if (result.status == 1) {
                    //  alert('111: ' + result.content);
                    location.href = "/success/" + result.keyID
                } else if (result.status == 2) {
                    // $('.error-all').find('.help-block').html(result.content.[0]['msg']);
                    // $('.error-all').removeClass('has-success').addClass('has-error');
                    //
                    $('.errPopup').show();
                    $('.alert-upload').html(result.content[0]['msg']);
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                } else if (result.status == 3) {
                    // $('.error-all').find('.help-block').html(result.content);
                    // $('.error-all').removeClass('has-success').addClass('has-error');
                    //
                    $('.errPopup').show();
                    $('.alert-upload').html(result.content);
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                } else {
                    // $('.error-all').find('.help-block').html('Undefined error');
                    // $('.error-all').removeClass('has-success').addClass('has-error');
                    //
                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                }
            },
            error: function(jqXHR, exception) {
                    //show error message

                    // if (jqXHR.status == 200 || jqXHR.status == 0) {
                    //     $('.errPopup').show();
                    //     $('.alert-upload').html(jqXHR.status + ' - ' + exception);
                    //     $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //         $("#danger-alert").slideUp(1000);
                    //         $('.errPopup').hide();
                    //     });

                    // } else {

                    // location.href = "/upload"
                    // $('.error-all').find('.help-block').html(jqXHR.status + ' - ' + exception);
                    // $('.error-all').removeClass('has-success').addClass('has-error');
                    //
                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    // }

                }
                // timeout: 300000
        }).always(function(data) {

            $('#loading').hide();

        });
    })

    function checkFormBuildUpdateAndroid() {
        var check;
        if ($('#password_keystore').val() == '') {
            $('#password_keystore').attr('placeholder', 'Keystore password can not be empty ');
            $('#password_keystore').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-password-keystore').removeClass('display-none').addClass('display-inline');
            check = false;
        }
        if ($('#alias_name').val() == '') {
            $('#alias_name').attr('placeholder', 'Alias name can not be empty ');
            $('#alias_name').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-alias-name').removeClass('display-none').addClass('display-inline');
            check = false;
        } else {
            check = true;
        }
        return check;
    }
    $('#btn-build-android-update').click(function() {
        if (checkFormBuildUpdateAndroid() == false) {
            return;
        }
        var formData = new FormData();
        var keystoreUpdate = $('#keystore-update').get(0).files[0];

        console.log(keystoreUpdate);

        formData.append('keystore_Update', keystoreUpdate, keystoreUpdate.name);
        formData.append('email', $('#email').val());
        formData.append('cKeyFolder', $('#keyIDFolder').val());
        formData.append('keystore_password', $('#password_keystore').val());
        formData.append('alias_name', $('#alias_name').val());

        if (keystoreUpdate.size > 5000000) {
            $('.errPopup').show();
            $('.alert-upload').html('The "' + keystoreUpdate.name + '" is too large.Please upload a file less than or equal to 5MB.');
        } else if (keystoreUpdate.name.split('.').pop() != 'keystore') {
            $('.errPopup').show();
            $('.alert-upload').html('Please upload a file with a valid extension (*.keystore)');
        } else {

            $('#loading').show();
            $.ajax({
                url: "/build-android-update",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                datatype: "json",
                success: function(result) {

                    if (result.status == 1) {
                        //  alert('111: ' + result.content);
                        console.log(result);
                        location.href = "/success/" + result.keyID;

                    } else if (result.status == 2) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);

                    } else if (result.status == 3) {
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                    } else {
                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                    }
                },
                error: function(jqXHR, exception) {

                        $('.errPopup').show();
                        $('.alert-upload').html('Oops, something went wrong');
                        // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                        //     $("#danger-alert").slideUp(1000);
                        //     $('.errPopup').hide();
                        // });
                        // }
                    }
                    // timeout: 300000
            }).always(function(data) {
                // alert('--' + JSON.stringify(data));
                $('#loading').hide();
                // alert(data);
            });
        }
    });
    // $(function send_ajax_build_android() {});
});