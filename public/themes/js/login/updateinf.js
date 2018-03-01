
$(document).ready(function () {
    var firstname = $('#updateinf-firstname');
    var lastname = $('#updateinf-lastname');
    var username = $('#updateinf-username');
    var email = $('#updateinf-email');
    var password = $('#updateinf-pass');
    var comfirmpass = $('#updateinf-comfirmpass');
    var address = $('#updateinf-address');
    var country = $('#updateinf-country');
    var zipcode = $('#updateinf-zipcode');

    $("#updateinf-country").text("United Kingdom");
    $("#updateinf-country").val("229");

    $('#deploy-content').click(() => {
        $('#country1').hide();
    })
    $(".clickcountry").click((event) => {
        $('#country1').toggle();
        event.stopPropagation();
    });
    $('#country1>li').click(function () {
        $("#updateinf-country").text($(this).text());
        $("#updateinf-country").val($(this).val());
        $('#country1').toggle();
    });
    //err
    var errname = "Syntax error";
    var errempty = "Can not be empty";
    var erremail = "Your email is not valid";
    var errpass = "Please enter at least 6 characters";
    var errconfirmpass = "Please enter the same password as above";
    var errzipcode = "Zipcode is malformed";
    // regex
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var name1Reg = /([_+.!@#$%^&*();\/|<>"'])+/;
    var addressReg = /([+!@#$%^*();\|<>"'])+/;
    var nameReg = /^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|([a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*)$/;
    var numberReg = /^[a-zA-Z0-9]*$/;
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
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
    // valid
    function fnerrzipcode(a, b) {
        a.val("");
        a.attr({ "class": "resetinputloginerr", "placeholder": errzipcode });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }
    function fnerrconfirmpass(a, b) {
        a.val("");
        a.attr({ "class": "resetinputloginerr", "placeholder": errconfirmpass });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }
    function fnerrpass(a, b) {
        a.val("");
        a.attr({ "class": "resetinputloginerr", "placeholder": errpass });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }
    function fnerrempty(a, b) {
        a.val("");
        a.attr({ "class": "resetinputloginerr", "placeholder": errempty });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }
    function fnerrname(a, b) {
        a.val("");
        a.attr({ "class": "resetinputloginerr", "placeholder": errname });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }
    function hideerr(a, b) {
        a.attr({ "class": "resetinputlogin" });
        b.attr("src", "");
    }
    function hideerryey(a, b) {
        a.attr({ "class": "resetinputlogin" });
        b.attr("src", "/themes/img/login/iconeye1.png");
    }

    function formupdateinf() {
        if (trimSpace(firstname.val()) == "") {
            fnerrempty(firstname, $('#iconerr1')); return false;
        } else if (name1Reg.test(firstname.val()) == true) {
            fnerrname(firstname, $('#iconerr1')); return false;
        } else {
            hideerr(firstname, $('#iconerr1'));
        }

        if (trimSpace(lastname.val()) == "") {
            fnerrempty(lastname, $('#iconerr2')); return false;
        } else if (name1Reg.test(lastname.val()) == true) {
            fnerrname(lastname, $('#iconerr2')); return false;
        } else {
            hideerr(lastname, $('#iconerr2'));
        }

        if (trimSpace(username.val()) == "") {
            fnerrempty(username, $('#iconerr3')); return false;
        } else if (nameReg.test(username.val()) == false) {
            fnerrname(username, $('#iconerr3')); return false;
        } else {
            hideerr(username, $('#iconerr3'));
        }

        if (trimSpace(email.val()) == "") {
            fnerrempty(email, $('#iconerr4')); return false;
        } else if (emailReg.test(email.val()) == false) {
            fnerrname(email, $('#iconerr4')); return false;
        } else {
            hideerr(email, $('#iconerr4'));
        }

        if (trimSpace(password.val()) == "") {
            fnerrempty(password, $('#iconeye')); return false;
        } else if (password.val().length < 6) {
            fnerrpass(password, $('#iconeye')); return false;
        } else {
            hideerryey(password, $('#iconeye'));
        }

        if (trimSpace(comfirmpass.val()) == "") {
            fnerrempty(comfirmpass, $('#iconerr6')); return false;
        } else if (comfirmpass.val() != password.val()) {
            fnerrconfirmpass(comfirmpass, $('#iconerr6')); return false;
        } else {
            hideerr(comfirmpass, $('#iconerr6'));
        }
        if (trimSpace(address.val()) == "") {
            fnerrempty(address, $('#iconerr7')); return false;
        } else if (addressReg.test(address.val()) == true) {
            fnerrname(address, $('#iconerr7')); return false;
        } else {
            hideerr(address, $('#iconerr7'));
        }
        if (trimSpace(zipcode.val()) == "") {
            fnerrempty(zipcode, $('#iconerr9')); return false;
        } else if (numberReg.test(zipcode.val()) == false) {
            fnerrzipcode(zipcode, $('#iconerr9'));
            return false;
        } else {
            hideerr(zipcode, $('#iconerr9'));
        }
        return true;
    };

    $('#form-updateinf').submit(function () {
        if (formupdateinf() == true) {
            $('#loading').show();
            $.ajax({
                type: "post",
                url: "/updateinf/ok",
                dataType: "json",
                data: {
                    firstname: trimSpace(firstname.val()), lastname: trimSpace(lastname.val()), username: username.val(), email: email.val(), password: password.val(),
                    address: trimSpace(address.val()), country: country.val(), zipcode: zipcode.val()
                },
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
                        window.location.href = "/index";
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


});