$(document).ready(function () {
    var username = $('[name = "username"]');
    var password = $('[name = "pass"]');
    var rememberme = $("#rememberme");
    var remember = "";
    rememberme.click(() => {
        if (rememberme.is(':checked')) {
            rememberme.val("true")
        } else {
            rememberme.val("faile")
        }
    })
    var email = $('[name = "emailresetpass"]');
    var errname = "Syntax error";
    var errempty = "Can not be empty";
    var erremail = "Your email is not valid";


    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        // console.log(sPageURL);
        // console.log(sURLVariables);
        // console.log(sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {

                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
            // console.log(sParameterName);
        }

    };
    var status = getUrlParameter("status");
    if (status == "no") {
        $('#myModal').modal('hide');
        $('.successPopup').show();
        $(".contenemail").text("");
        $(".contenemail").text("Congratulations on signing up for a successful account! Please visit your E-mail address to validate your email")
        $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
            $("#success-alert").slideUp(1000);
            $('.successPopup').hide();
        });
    }
    if (status == "yes") {
        $('#myModal').modal('hide');
        $('.successPopup').show();
        $(".contenemail").text("");
        $(".contenemail").text("You have successfully verified the email")
        $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
            $("#success-alert").slideUp(1000);
            $('.successPopup').hide();
        });
    }

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var nameReg = /^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|([a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*)$/;
    var numberReg = /^[0-9]+$/;
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // validate form login
    function loginform() {
        if (trimSpace(username.val()) == "") {
            username.val("");
            username.attr({
                "class": "resetinputloginerr",
                "placeholder": errempty
            });
            $('#iconerr1').attr("src", "/themes/img/login/iconerr.png")
            username.focus();
            return false;
        } else if (nameReg.test(username.val()) == false) {
            username.val("");
            username.attr({
                "class": "resetinputloginerr",
                "placeholder": errname
            });
            $('#iconerr1').attr("src", "/themes/img/login/iconerr.png")
            username.focus();
            return false;
        } else {
            username.attr({
                "class": "resetinputlogin"
            });
            $('#iconerr1').attr("src", "")
        }
        if (password.val() == "") {
            password.val("");
            password.attr({
                "class": "resetinputloginerr",
                "placeholder": errempty
            });
            $('#iconeye').attr("src", "/themes/img/login/iconerr.png")
            password.focus();
            return false;
        } else if (password.val().length < 6) {
            password.val("");
            password.attr({
                "class": "resetinputloginerr",
                "placeholder": errname
            });
            $('#iconeye').attr("src", "/themes/img/login/iconerr.png")
            password.focus();
            return false;
        } else {
            password.attr({
                "class": "resetinputlogin"
            });
            $('#iconeye').attr("src", "/themes/img/login/iconeye1.png")
        }
        return true;
    };
    // hide and show password   
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

    // $('#iconeye').mouseup(function () {
    //     password.attr("type", "password");
    //     $('#iconeye').attr("src", "/themes/img/login/iconeye1.png")
    // });
    // $('#iconeye').mouseout(function () {
    //     password.attr("type", "password");
    //     $('#iconeye').attr("src", "/themes/img/login/iconeye1.png")
    // });
    // validate form reset password
    function resetpassform() {
        // console.log(email.val());
        if (email.val() == "") {
            email.val("");
            email.attr({
                "class": "resetinputloginerr",
                "placeholder": errempty
            });
            $('[name = "iconemail"]').attr("src", "/themes/img/login/iconemailerr.png");
            email.focus();
            return false;
        }
        if (emailReg.test(email.val()) == false) {
            email.val("");
            email.attr({
                "class": "resetinputloginerr",
                "placeholder": erremail
            });
            $('[name = "iconemail"]').attr("src", "/themes/img/login/iconemailerr.png");
            email.focus();
            return false;
        }
        return true;
    };
    // ajax post login
    $('#form-login').submit(function () {
        if (loginform() == true) {
            $.ajax({
                type: "post",
                url: "/login/tk",
                dataType: "json",
                data: {
                    username: username.val(),
                    password: password.val(),
                    rememberme: rememberme.val()
                },
                success: function (data) {
                    if (data.status == "3") {
                        $('.errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    } else if (data.status == "1") {
                        window.location.href = "/index";
                    } else if (data.status == "2") {
                        $('.errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    }
                }
            })
        }
    });
    $('#form-forgotpass').submit(function () {
        // alert(resetpassform());
        // resetpassform() == false;
        // resetpassform();
        if (resetpassform() == true) {
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/forgot",
                dataType: "json",
                data: {
                    email: email.val()
                },
                success: (data) => {
                    if (data.status == "3") {
                        $('#myModal').modal('hide');
                        $('.errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#danger-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#danger-alert").slideUp(1000);
                            $('.errPopup').hide();
                        });
                    } else if (data.status == "1") {
                        $('#myModal').modal('hide');
                        $('#successPopup').show(500);
                        $(".contenemail").text("");
                        $(".contenemail").text("We have sent you an E-mail with instructions on how to reset your password");
                        $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#success-alert").slideUp(1000);
                            $('.successPopup').hide();
                        });
                    } else if (data.status == "2") {
                        $('#myModal').modal('hide');
                        $('#successPopup').show(500);
                        $(".contenemail").text("");
                        $(".contenemail").text("We have sent you an E-mail with instructions on how to reset your password");
                        $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#success-alert").slideUp(1000);
                            $('.successPopup').hide();
                        });
                    }
                }
            }).always(function (data) {
                $('#loading').hide();
                email.val("");
            });
        }
    });
});