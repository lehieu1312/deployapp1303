$(document).ready(function () {
    var password = $('[name = "passnew"]');
    var confirmpass = $('[name = "passretype"]');
    var oldpass = $('[name = "passcurrent"]');

    var firstname = $('#editprofile-firstname');
    var lastname = $('#editprofile-lastname');
    var email = $('#editprofile-email');
    var address = $('#editprofile-address');
    var country = $('#editprofile-country');
    var zipcode = $('#editprofile-zipcode');

    // regex
    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }

    var name1Reg = /([_+.!@#$%^&*();\/|<>"'])+/;
    var addressReg = /([+!@#$%^*();\|<>"'])+/;
    var nameReg = /^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|([a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*)$/;
    var numberReg = /^[a-zA-Z0-9]*$/;
    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;


    //error
    var errname = "Syntax error";
    var errempty = "Can not be empty";
    var erremail = "Your email is not valid";
    var errpass = "Please enter at least 6 characters";
    var errconfirmpass = "Please enter the same password as above";
    var errzipcode = "Zipcode is malformed";

    $('#deploy-detail-content').click(() => {
        $('#country1').hide();
    })
    $(".clickcountry").click((event) => {
        $('#country1').toggle();
        event.stopPropagation();
    });
    $('#country1>li').click(function () {
        $("#editprofile-country").text($(this).text());
        $("#editprofile-country").val($(this).val());
        $('#country1').hide();
    });

    // eye password
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
        oldpass.attr("type", "text");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeye1').hide();
        $('#iconeyehide1').show();
    });
    $('#iconeyehide1').click(function () {
        oldpass.attr("type", "password");
        // $('#iconeye').attr("src", "/themes/img/login/iconeyehide.png")
        $('#iconeyehide1').hide();
        $('#iconeye1').show();
    });

    // validate editprofile
    function fnerrzipcode(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errzipcode
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrconfirmpass(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errconfirmpass
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrpass(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errpass
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrempty(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errempty
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function fnerrname(a, b) {
        a.val("");
        a.attr({
            "class": "resetinputloginerr",
            "placeholder": errname
        });
        b.attr("src", "/themes/img/login/iconerr.png");
        a.focus();
    }

    function hideerr(a, b) {
        a.attr({
            "class": "resetinputlogin"
        });
        b.attr("src", "");
    }

    function hideerryey(a, b) {
        a.attr({
            "class": "resetinputlogin"
        });
        b.attr("src", "/themes/img/login/iconeye1.png");
    }

    function formeditprofile() {
        if (trimSpace(firstname.val()) == "") {
            fnerrempty(firstname, $('#iconerr1'));
            return false;
        } else if (name1Reg.test(firstname.val()) == true) {
            fnerrname(firstname, $('#iconerr1'));
            return false;
        } else {
            hideerr(firstname, $('#iconerr1'));
        }

        if (trimSpace(lastname.val()) == "") {
            fnerrempty(lastname, $('#iconerr2'));
            return false;
        } else if (name1Reg.test(lastname.val()) == true) {
            fnerrname(lastname, $('#iconerr2'));
            return false;
        } else {
            hideerr(lastname, $('#iconerr2'));
        }

        if (trimSpace(email.val()) == "") {
            fnerrempty(email, $('#iconerr4'));
            return false;
        } else if (emailReg.test(email.val()) == false) {
            fnerrname(email, $('#iconerr4'));
            return false;
        } else {
            hideerr(email, $('#iconerr4'));
        }
        if (trimSpace(address.val()) == "") {
            fnerrempty(address, $('#iconerr7'));
            return false;
        } else if (addressReg.test(address.val()) == true) {
            fnerrname(address, $('#iconerr7'));
            return false;
        } else {
            hideerr(address, $('#iconerr7'));
        }
        if (trimSpace(zipcode.val()) == "") {
            fnerrempty(zipcode, $('#iconerr9'));
            return false;
        } else if (numberReg.test(zipcode.val()) == false) {
            fnerrzipcode(zipcode, $('#iconerr9'));
            return false;
        } else {
            hideerr(zipcode, $('#iconerr9'));
        }
        return true;
    };

    function formchangepassword() {
        if (trimSpace(oldpass.val()) == "") {
            fnerrempty(oldpass, $('#iconerr10'));
            return false;
        } else if (oldpass.val().length < 6) {
            fnerrpass(oldpass, $('#iconerr10'));
            return false;
        } else {
            hideerr(oldpass, $('#iconerr10'));
        }

        if (trimSpace(password.val()) == "") {
            fnerrempty(password, $('#iconeye'));
            return false;
        } else if (password.val().length < 6) {
            fnerrpass(password, $('#iconeye'));
            return false;
        } else {
            hideerryey(password, $('#iconeye'));
        }
        if (trimSpace(confirmpass.val()) == "") {
            fnerrempty(confirmpass, $('#iconeye1'));
            return false;
        } else if (confirmpass.val() != password.val()) {
            fnerrconfirmpass(confirmpass, $('#iconeye1'));
            return false;
        } else {
            hideerryey(confirmpass, $('#iconeye1'));
        }
        return true;
    }


    $("#btn-editprofile-reset").click(() => {
        $('[class = "resetinputloginerr"]').attr({
            "class": "resetinputlogin"
        })
        $('[src = "/themes/img/login/iconerr.png"]').attr("src", "");
        $('#form-editprofile')[0].reset();
    });
    // $('#btn-changepass').hide();
    $('#btn-editprofile').addClass('dmm')
    $('#edit-personal').click(() => {
        $('#btn-editprofile').addClass('dmm')
        $('#btn-editprofile').removeClass('laidmm')
    })
    $('#change-pass').click(() => {
        $('#btn-editprofile').addClass('laidmm')
        $('#btn-editprofile').removeClass('dmm')
    })
    var tap1 = true;
    $('#edit-personal').click(() => {
        tap1 = true;
    })
    $('#change-pass').click(() => {
        tap1 = false;
    })
    // ajax editprofile



    $('#form-editprofile').submit(function () {
        if (tap1 == true) {
            if (formeditprofile() == true) {
                $('#loading').show();
                $.ajax({
                    type: "post",
                    url: "/editprofile/ok",
                    dataType: "json",
                    data: {
                        firstname: trimSpace(firstname.val()),
                        lastname: trimSpace(lastname.val()),
                        email: email.val(),
                        address: trimSpace(address.val()),
                        country: country.val(),
                        zipcode: zipcode.val()
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
                            firstname.val(data.user.firstname);
                            lastname.val(data.user.lastname);
                            email.val(data.user.username);
                            address.val(data.user.address);
                            zipcode.val(data.user.szipcode);
                            country.val(data.user.country);
                            country.text(data.country);
                            $('#successPopup').show(500);
                            $(".contenemail").text("");
                            $(".contenemail").text("Update successful");
                            $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                                $("#success-alert").slideUp(1000);
                                $('.successPopup').hide();
                            });
                        } else if (data.status == "2") {
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
            }
        } else {
            if (formchangepassword() == true) {
                $('#loading').show();
                $.ajax({
                    type: "post",
                    url: "/changepassword/ok",
                    dataType: "json",
                    data: {
                        oldpass: trimSpace(oldpass.val()),
                        password: trimSpace(password.val())
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
                            password.val("");
                            confirmpass.val("");
                            oldpass.val("");
                            $('#successPopup').show(500);
                            $(".contenemail").text("");
                            $(".contenemail").text("Update successful");
                            $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                                $("#success-alert").slideUp(1000);
                                $('.successPopup').hide();
                            });
                        } else if (data.status == "2") {
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
            }
        }
    })


    // up avartar
    $('#fileavartar').on('change', function () {
        var formData = new FormData();
        var file = $(this).get(0).files[0];
        formData.append('avartar', file, file.name);

        // console.log(file.size);
        // console.log(file);
        if (file.size > 10485760) {
            alert("size max");
            // $('.errPopup').show();
            // $('.alert-upload').html('File is too large (' + formatBytes(file.size) + '). The max filesize for your plan is 150Mb.');
            // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function () {
            //     $("#danger-alert").slideUp(1000);
            //     $('.errPopup').hide();
            // });
        }
        // else if (file.name.split('.').pop().toLowerCase() != 'png' && file.name.split('.').pop().toLowerCase() != 'jpg' && file.name.split('.').pop().toLowerCase() != 'jpeg'&& file.name.split('.').pop().toLowerCase() != 'jpe') {
        //     alert("system error");
        //     // $('.errPopup').show();
        //     // $('.alert-upload').html('File upload is not zip format');
        //     // $("#danger-alert").fadeTo(7000, 1000).slideUp(1000, function () {
        //     //     $("#danger-alert").slideUp(1000);
        //     // });
        // }
        else {
            $("#avartaruser").hide();
            $("#rolling-avatar-medium").show();
            // setTimeout(() => {
            $.ajax({
                url: '/changeprofile',
                data: formData,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data) {
                    $("#avartaruser").show();
                    $('#avartaruser').attr('src', "/themes/img/profile/" + data)
                    // alert(data);
                }
            }).always(function (data) {
                $("#rolling-avatar-medium").hide();
            });;
            // }, 5000);

        }

    })

});
// click onpen upfile
function openFileOption() {
    document.getElementById("fileavartar").click();
}