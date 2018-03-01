$(document).ready(function() {
    $("#android").click(function() {
        $('#platformval').val('android');
        // $(".pl-ios").removeClass("platform-active");
        $(".pl-android").addClass("platform-active");
        $(".tile-pl-android").css("color", "#00afee")

        $(".pl-ios").removeClass("platform-active");
        // $(".pl-android").addClass("platform-active");
        $(".tile-pl-ios").css("color", "#6e7786")

        //Do stuff when clicked
    });
    // $("#android").focusout(function() {

    //     $(".pl-android").removeClass("platform-active");
    //     // $(".pl-android").addClass("platform-active");
    //     $(".tile-pl-android").css("color", "#6e7786")

    //         //Do stuff when clicked
    // });

    $("#ios").click(function() {
        $('#platformval').val('ios');
        $(".pl-ios").addClass("platform-active");
        $(".tile-pl-ios").css("color", "#00afee")
        $(".pl-android").removeClass("platform-active");
        $(".tile-pl-android").css("color", "#6e7786");

        // $('.errPopup').show();
        // $('.alert-upload').html('The Platform is not supported at the moment');
        // $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
        //     $("#danger-alert").slideUp(1000);
        //     $('.errPopup').hide();
        // });

        //Do stuff when clicked
    });
    // $("#ios").focusout(function() {
    //     $('#platformval').val('');
    //     $(".pl-ios").removeClass("platform-active");
    //     // $(".pl-android").addClass("platform-active");
    //     $(".tile-pl-ios").css("color", "#6e7786")

    //         //Do stuff when clicked
    // });

    // $("#ios").click(function() {
    //     $('#platformval').val('ios');
    //     $(".pl-android").removeClass("platform-active");
    //     $(".pl-ios").addClass("platform-active");
    //     $(".tile-pl-ios").css("color", "#00afee")

    //     $('.errPopup').show();

    //     $("#danger-alert").fadeTo(3000, 1000).slideUp(1000, function() {
    //         $("#danger-alert").slideUp(1000);
    //         $('.errPopup').hide();
    //     });

    //     //Do stuff when clicked
    // });
    $('#btn-send-platform').click(function() {
        if ($('#platformval').val() == '') {

            $('.errPopup').show();
            $('.alert-upload').html('Please choose a platform');
            $("#danger-alert").fadeTo(3000, 1000).slideUp(1000, function() {
                $("#danger-alert").slideUp(1000);
                $('.errPopup').hide();
            });
        } else {
            var platform = $('#platformval').val();
            var url = '/platforms';
            // var url = '/platforms';
            // if (platform == 'android') {
            //     url = '/platforms';
            // } else {
            //     url = '/platforms';
            //     // $('.errPopup').show();
            //     // $('.alert-upload').html('The Platform is not supported at the moment');
            //     // $("#danger-alert").fadeTo(3000, 1000).slideUp(1000, function() {
            //     //     $("#danger-alert").slideUp(1000);
            //     //     $('.errPopup').hide();
            //     // });
            //     // return;
            // }


            $('#loading').show();
            $.ajax({
                url: url,
                type: "POST",
                data: {
                    cKeyID: $('#aKey').val(),
                    cPlatform: platform,
                },
                //  processData: false,
                //contentType: false,
                success: function(result) {

                    // $('#loading').text(result);
                    if (result.status == 1 && result.platforms == 'android') {
                        console.log(result.content);
                        // alert('success: ' + result.content);
                        location.href = "/build-android/" + result.key
                    } else if (result.status == 1 && result.platforms == 'ios') {
                        console.log(result.content);
                        // alert('success: ' + result.content);
                        location.href = "/build-ios/" + result.key
                    } else if (result.status == 3) {
                        //alert('Error: ' + result.content);
                        $('.errPopup').show();
                        $('.alert-upload').html(result.content);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                        // $('.error-all').find('.help-block').html(result.content);
                        // $('.error-all').removeClass('has-success').addClass('has-error');
                    } else {

                    }
                },
                error: function(jqXHR, exception) {
                    //show error message

                    $('.errPopup').show();
                    $('.alert-upload').html('Oops, something went wrong');
                    $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function() {
                        $("#danger-alert").slideUp(1000);
                        $('.errPopup').hide();
                    });
                    $('.errPopup').hide();
                    // }
                },
                timeout: 2000000
            }).always(function(data) {

                $('#loading').hide();

            });

        }
    })
});