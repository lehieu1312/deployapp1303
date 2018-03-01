$(document).ready(function() {
    function validateEmail(email) {
        var str = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
        return str.test(email);
    }

    function checkTeamID(str) {
        var id = /^[A-Z0-9]{10}$/;
        return id.test(str);
    }

    function validateIdentifier(str) {
        var id = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/;
        return id.test(str);
    }

    function checkCharSpecialTwo(str) {
        var regex = /[!@#$%^&*()~_`+\- =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {
            //   alert('1');
            return checkF = false;
        } else return true;
    }

    function checkCharSpecialText(str) {
        var regex = /[!@#$%^&*()~`+\=\[\]{};':"\\|<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {
            //   alert('1');
            return checkF = false;
        } else return true;
    }

    function checkCharSpecialAlias(str) {
        var regex = /[!@#$%^&*()~`+\ =\[\]{};':"\\|,<>\/?¿§«»ω⊙¤°℃℉€¥£¢¡®©1234567890]+/;
        //   var regexNumber = /[0123456789]+/;
        if (str.search(regex) != -1) {
            //   alert('1');
            return checkF = false;
        } else return true;
    }

    function validateForm_build_ios() {
        // var checkmail = validateEmail($('#email').val());
        var check;
        if (validateEmail($('#email').val()) == false || $('#email').val() == "") {
            $('#email').val('');
            $('#email').attr('placeholder', 'Please enter a valid email address');
            $('#email').addClass('input-holder').addClass('border-bottom-red');
            $('#icon-err-email').removeClass('display-none').addClass('display-inline');
            check = false;
        }
        // if ($('#teamID').val() == "") {
        //     $('#teamID').attr('placeholder', 'TeamID must be longer 12 characters,Number and Capital letter ');
        //     $('#teamID').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-teamid').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else if (checkTeamID($('#teamID').val()) == false) {
        //     $('#teamID').val('');
        //     $('#teamID').attr('placeholder', 'TeamID must be longer 12 characters,Number and Capital letter');
        //     $('#teamID').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-teamid').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else {
        //     $('#teamID').removeClass('input-holder').removeClass('border-bottom-red');
        //     $('#icon-err-teamid').removeClass('display-inline').addClass('display-none');
        // }

        // if ($('#UUID').val() == "") {
        //     $('#UUID').attr('placeholder', 'Enter valid UUID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        //     $('#UUID').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-uuid').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else if (validateIdentifier($('#UUID').val()) == false) {
        //     $('#UUID').val('');
        //     $('#UUID').attr('placeholder', 'Enter valid UUID, like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        //     $('#UUID').addClass('input-holder').addClass('border-bottom-red');
        //     $('#icon-err-uuid').removeClass('display-none').addClass('display-inline');
        //     check = false;
        // } else {
        //     $('#UUID').removeClass('input-holder').removeClass('border-bottom-red');
        //     $('#icon-err-uuid').removeClass('display-inline').addClass('display-none');
        // }

        if (check == false) {
            return false
        }
        return true;
    }

    function formatBytes(a, b) {
        if (0 == a) return "0 Bytes";
        var c = 1e3,
            d = b || 2,
            e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }
    $('#btn-deploy-ios').click(function() {
        // $('.errPopup').show();
        // $('.alert-upload').html('Our Server is maintaince.');
        // return;
        // return location.href = "/maintaince";
        if (validateForm_build_ios() == true) {
            var obj = {};
            var formData = new FormData();
            var adhoc_file = $('#provision-adhoc').get(0).files[0];
            var appstore_file = $('#provision-appstore').get(0).files[0];
            var certificate_file_adhoc = $('#certificate-file-adhoc').get(0).files[0];
            var certificate_file_appstore = $('#certificate-file-appstore').get(0).files[0];
            console.log(adhoc_file);
            console.log(appstore_file);
            console.log(certificate_file_adhoc);
            console.log(certificate_file_appstore);

            formData.append('email', $('#email').val());
            formData.append('cKeyFolder', $('#keyID').val());
            var caseOne, caseTwo, caseThree;
            var checkForm = false;
            // if (typeof certificate_file_appstore == 'undefined') {
            //     console.log('day la value null');
            // }
            if (typeof adhoc_file != 'undefined' && typeof certificate_file_adhoc != 'undefined' &&
                (typeof appstore_file == 'undefined' || typeof certificate_file_appstore == 'undefined')) {
                caseOne = true;
                formData.append('provisionfile_adhoc', adhoc_file, adhoc_file.name);
                formData.append('certificatefile_adhoc', certificate_file_adhoc, certificate_file_adhoc.name);
                formData.append('provisionfile_appstore', appstore_file, '');
                formData.append('certificatefile_appstore', certificate_file_appstore, '');
                if (adhoc_file.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + adhoc_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (adhoc_file.name.split('.').pop() != 'mobileprovision') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (certificate_file_adhoc.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + certificate_file_adhoc.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (certificate_file_adhoc.name.split('.').pop() != 'p12') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else {
                    checkForm = true;
                }
            } else if (typeof appstore_file != 'undefined' && typeof certificate_file_appstore != 'undefined' &&
                (typeof adhoc_file == 'undefined' || typeof certificate_file_adhoc == 'undefined')) {
                caseTwo = true;
                formData.append('provisionfile_adhoc', adhoc_file, '');
                formData.append('certificatefile_adhoc', certificate_file_adhoc, '');
                formData.append('provisionfile_appstore', appstore_file, appstore_file.name);
                formData.append('certificatefile_appstore', certificate_file_appstore, certificate_file_appstore.name);

                if (appstore_file.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + appstore_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (certificate_file_appstore.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + certificate_file_appstore.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (appstore_file.name.split('.').pop() != 'mobileprovision') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else if (certificate_file_appstore.name.split('.').pop() != 'p12') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else {
                    checkForm = true;
                }
            } else if (typeof appstore_file != 'undefined' && typeof certificate_file_appstore != 'undefined' &&
                typeof adhoc_file != 'undefined' && typeof certificate_file_adhoc != 'undefined') {
                caseThree = true;
                formData.append('provisionfile_adhoc', adhoc_file, adhoc_file.name);
                formData.append('certificatefile_adhoc', certificate_file_adhoc, certificate_file_adhoc.name);
                formData.append('provisionfile_appstore', appstore_file, appstore_file.name);
                formData.append('certificatefile_appstore', certificate_file_appstore, certificate_file_appstore.name);
                if (adhoc_file.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + adhoc_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (adhoc_file.name.split('.').pop() != 'mobileprovision') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else if (certificate_file_adhoc.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + certificate_file_adhoc.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (certificate_file_adhoc.name.split('.').pop() != 'p12') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else if (appstore_file.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + appstore_file.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (certificate_file_appstore.size > 5000000) {
                    $('.errPopup').show();
                    $('.alert-upload').html('The "' + certificate_file_appstore.name + '" is too large.Please upload a file less than or equal to 5MB.');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    //     $('.errPopup').hide();
                    // });
                    checkForm = false;
                } else if (appstore_file.name.split('.').pop() != 'mobileprovision') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.mobileprovision)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else if (certificate_file_appstore.name.split('.').pop() != 'p12') {
                    $('.errPopup').show();
                    $('.alert-upload').html('Please upload a file with a valid extension (*.p12)');
                    // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                    //     $("#danger-alert").slideUp(1000);
                    // });
                    checkForm = false;
                } else {
                    checkForm = true;
                }
            } else {
                $('.errPopup').show();
                $('.alert-upload').html('You must upload all files in "App to the Testing" section Or You must upload all files in "App to the App Store" section Or all file');
                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                //     $("#danger-alert").slideUp(1000);
                // });
                checkForm = false;
            }

            if (checkForm == false) {
                return;
            } else {
                $('#loading').show();
                $.ajax({
                    url: "/save-info-ios",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    datatype: "json",
                    success: function(result) {
                        // alert('success: ' + JSON.stringify(result));
                        // alert('success: ' + result.content[0].msg);
                        // alert('success: ' + JSON.stringify(result));
                        // $('#loading').text(result);
                        if (result.status == 1) {
                            //  alert('111: ' + result.content);
                            console.log(result);
                            location.href = "/success-ios/" + result.keyFolder
                                // $('.errPopup').show();
                                // $('.alert-upload').html(result.content);
                                // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                                //     $("#danger-alert").slideUp(1000);
                                //     $('.errPopup').hide();
                                // });
                        } else if (result.status == 2) {
                            // $('.error-all').find('.help-block').html(result.content.[0]['msg']);
                            // $('.error-all').removeClass('has-success').addClass('has-error');

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
            // $('#loading').show();
            // alert('le an');
            // $('.form-group').find('.help-block').html('');
            // $('.form-group').removeClass('has-error').addClass('has-success');
            // $(".spinner").fadeIn();
        }
    });

    $('form#fBuildiosdiawi').submit(function() {

            // if (validateForm_build_ios() == true) {
            var formData = new FormData($(this)[0]);
            var obj = {};
            $('#loading').show();
            // alert('le an');
            // $('.form-group').find('.help-block').html('');
            // $('.form-group').removeClass('has-error').addClass('has-success');
            // $(".spinner").fadeIn();
            $.ajax({
                url: "/build-ios-by-diawi",
                type: "POST",
                data: formData,
                //$("#fBuildiosdiawi").serialize()
                //  processData: false,
                //contentType: false,
                success: function(result) {
                    // alert('success: ' + JSON.stringify(result));
                    // alert('success: ' + result.content[0].msg);
                    // alert('success: ' + JSON.stringify(result));
                    // $('#loading').text(result);
                    if (result.status == 1) {
                        alert(result.content);
                        // location.href = "/success-ios/" + result.keyID
                    } else if (result.status == 2) {
                        // $('.error-all').find('.help-block').html(result.content.[0]['msg']);
                        // $('.error-all').removeClass('has-success').addClass('has-error');
                        //
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content[0]['msg']);
                        $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    } else if (result.status == 3) {
                        // $('.error-all').find('.help-block').html(result.content);
                        // $('.error-all').removeClass('has-success').addClass('has-error');
                        //
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                        $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function() {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    } else {
                        // $('.error-all').find('.help-block').html('Undefined error');
                        // $('.error-all').removeClass('has-success').addClass('has-error');
                        //
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
                        // }
                    }
                    // timeout: 300000
            }).always(function(data) {
                // alert('--' + JSON.stringify(data));
                $('#loading').hide();
                // alert(data);
            });
            // }
        })
        // function send_ajax_build_ios() {}
    $('#provision-adhoc').on('change', function(e) {
        // var label = $('#provision-adhoc').nextElementSibling;
        var fileName = '';
        fileName = e.target.value.split(/(\\|\/)/g).pop();
        // console.log(fileName);
        if (fileName) {
            // console.log('1');
            $('#text-file-profile-adhoc').html(fileName);
        } else {
            $('#text-file-profile-adhoc').html('*.mobileprovision');
        }

    });
    $('#certificate-file-adhoc').on('change', function(e) {
        // var label = $('#provision-adhoc').nextElementSibling;
        var fileName = '';
        fileName = e.target.value.split(/(\\|\/)/g).pop();
        // console.log(fileName);
        if (fileName) {
            // console.log('1');
            $('#text-file-certificate-adhoc').html(fileName);
        } else {
            $('#text-file-certificate-adhoc').html('*.p12');
        }

    });
    $('#provision-appstore').on('change', function(e) {
        // var label = $('#provision-adhoc').nextElementSibling;
        var fileName = '';
        fileName = e.target.value.split(/(\\|\/)/g).pop();
        // console.log(fileName);
        if (fileName) {
            // console.log('1');
            $('#text-file-profile-appstore').html(fileName);
        } else {
            $('#text-file-profile-appstore').html('*.mobileprovision');
        }

    });
    $('#certificate-file-appstore').on('change', function(e) {
        // var label = $('#provision-adhoc').nextElementSibling;
        var fileName = '';
        fileName = e.target.value.split(/(\\|\/)/g).pop();
        // console.log(fileName);
        if (fileName) {
            // console.log('1');
            $('#text-file-certificate-appstore').html(fileName);
        } else {
            $('#text-file-certificate-appstore').html('*.p12');
        }

    });

});