$(document).ready(function() {
    $('.close-modal-ios').click(function() {
        $('.modaldialogios').css('display', 'none');
    });
    $('#btn-noti-success-android').click(function() {
        $('#dialog-noti-succes-android').css('display', 'none');
    });
    // btn-cancel-noti-info-android
    $('#btn-cancel-noti-info-android').click(function() {
        $('#dialog-noti-info-android').css('display', 'none');
    });


    // demo-modal
    window.onclick = function(event) {
        $('.modaldialogios').css('display', 'none');
        // if ($('#dialog-history-file-uploaded').css('display') == 'block') {
        //     alert('1');
        // }
        // $('#dialog-history-file-uploaded').css('display', 'none');
    }

    if (window.location.pathname.toLowerCase() == "/register") {
        $("#accessfuntionregister").css('color', '#00afee');
    }
    if (window.location.pathname.toLowerCase() == "/login") {
        $("#accessfuntionlogin").css('color', '#00afee');
    }
    if (window.location.pathname.toLowerCase() == "/frequently-asked-questions") {
        $("#accessfuntionfaq").css('color', '#00afee');
    }

    $('.button-close-notification').click(function() {
        $('.errPopup').hide();
    })
    $(window).on("load", function() {
        var endright = $("#bs-example-navbar-collapse-1").offset().left;
        $("#errPopup").css('right', endright);
        $("#successPopup").css('right', endright);
    })
    $('#btn-ok-check-safari').click(function() {
        $('#loading-check-safari').css("display", "none");
    });
    ///////////
    $('#icon-eye-hide-build').hide();
    $('#icon-eye-build').click(function() {
        $('#keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build').hide();
        $('#icon-eye-hide-build').show();
    });
    $('#icon-eye-hide-build').click(function() {
        $('#keystore').attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-hide-build').hide();
        $('#icon-eye-build').show();
    });
    ////////////////icon eye update build
    $('#icon-eye-hide-build-update').hide();
    $('#icon-eye-build-update').click(function() {
        $('#password_keystore').attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-build-update').hide();
        $('#icon-eye-hide-build-update').show();
    });
    $('#icon-eye-hide-build-update').click(function() {
        $('#password_keystore').attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#icon-eye-hide-build-update').hide();
        $('#icon-eye-build-update').show();
    });
    ///
    $(window).on("resize", function() {
            if (window.innerWidth <= 768 && window.innerWidth >= 480) {
                $("#errPopup").css('right', '13px');
                $("#successPopup").css('right', '13px');
            }
            if (window.innerWidth <= 479) {
                $("#errPopup").css('right', '0px');
                $("#successPopup").css('right', '0px');
            }
            if (window.innerWidth > 769) {
                var endright = $("#bs-example-navbar-collapse-1").offset().left
                $("#errPopup").css('right', endright);
                $("#successPopup").css('right', endright);
            }

        })
        //track data///
    $('#data-track').DataTable();



})