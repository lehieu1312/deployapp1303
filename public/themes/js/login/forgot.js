$(document).ready(function () {
    var password = $('[name = "pass"]');
    var confirmpass = $('[name = "pass1"]');

    var email = $('[name = "emailresetpass"]');
    var errname = "Syntax error";
    var errempty = "Can not be empty";
    var errpass = "Please enter at least 6 characters";
    var errconfirmpass = "Please enter the same password as above";
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }


    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    var iduser = getUrlParameter("iduser");
    $('#iconeyehide').hide();
    $('#iconeye').click(function () {
        password.attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeye').hide();
        $('#iconeyehide').show();
    });
    $('#iconeyehide').click(function () {
        password.attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeyehide').hide();
        $('#iconeye').show();
    });

    $('#iconeyehide1').hide();
    $('#iconeye1').click(function () {
        confirmpass.attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeye1').hide();
        $('#iconeyehide1').show();
    });
    $('#iconeyehide1').click(function () {
        confirmpass.attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeyehide1').hide();
        $('#iconeye1').show();
    });
    function forgotform1() {
        if (trimSpace(password.val()) == "") {
            password.val("");
            password.attr({ "class": "resetinputloginerr", "placeholder": errempty });
            $('#iconeye').attr("src", "/themes/img/login/iconerr.png")
            password.focus();
            return false;
        }
        else if (password.val().length < 6) {
            password.val("");
            password.attr({ "class": "resetinputloginerr", "placeholder": errpass });
            $('#iconeye').attr("src", "/themes/img/login/iconerr.png")
            password.focus();
            return false;
        } else {
            password.attr({ "class": "resetinputlogin" });
            $('#iconeye').attr("src", "/themes/img/login/iconeye1.png")
        }

        if (trimSpace(confirmpass.val()) == "") {
            confirmpass.val("");
            confirmpass.attr({ "class": "resetinputloginerr", "placeholder": errempty });
            $('#iconeye1').attr("src", "/themes/img/login/iconerr.png")
            confirmpass.focus();
            return false;
        }
        else if (confirmpass.val() != password.val()) {
            confirmpass.val("");
            confirmpass.attr({ "class": "resetinputloginerr", "placeholder": errconfirmpass });
            $('#iconeye1').attr("src", "/themes/img/login/iconerr.png")
            confirmpass.focus();
            return false;
        } else {
            confirmpass.attr({ "class": "resetinputlogin" });
            $('#iconeye1').attr("src", "/themes/img/login/iconeye1.png")
        }
        return true;
    }

    $('#form-resetpass').submit(function () {
        if (forgotform1() == true) {
            $('#loading').show();
            $.ajax({
                type: "post",
                url: "/resetpass/ok",
                dataType: "json",
                data: { password: password.val(), iduser: iduser },
                success: function (data) {
                    if (data.status == "3") {
                        $('.errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    }
                    else if (data.status == "1") {
                        window.location.href = "/login";
                    }
                    else if (data.status == "2") {
                        $('.errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    }
                }
            }).always(function (data) {

                $('#loading').hide();
            });
        };
    });

})