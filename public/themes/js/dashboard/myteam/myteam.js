$(document).ready(() => {
    // $('#text-href').text("My Team");

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");
    var trmyteam = document.getElementsByClassName('tr-content-appversion');
    var email;
    var settr;
    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            if (deleteuser[i].style.display === "none") {
                deleteuser[i].style.display = "block";
            } else {
                deleteuser[i].style.display = "none";
            }
            settr = i;
            event.stopPropagation();
        })
        elementdelete[i].addEventListener('click', () => {
            email = emaildelete[i].innerHTML;
            console.log(email);
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })

    var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var erremail = "Your email is not valid";
    var errempty = "Can not empty";

    function checkformadduser() {
        if (trimSpace($(".textarea-adduser").val()) == "") {
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": errempty
            });
            return false;
        } else if (emailReg.test($(".textarea-adduser").val()) == false) {
            $(".textarea-adduser").val("")
            $(".textarea-adduser").addClass("textarea-err")
            $(".textarea-adduser").attr({
                "placeholder": erremail
            });
            return false;
        }
        return true;
    }

    $('#delete-ok').click(() => {
        $('#loading').show();
        $('#mymodal-deleteuser').modal('hide');
        $.ajax({
            type: "POST",
            url: "/deleteuser",
            dataType: "json",
            data: {
                email: trimSpace(email),
                idApp: $('#idapp-using').val()
            },
            success: (data) => {
                if (data.status == "1") {
                    $('#successPopup').show(500);
                    $(".contenemail").text("");
                    $(".contenemail").text("Deleted !");
                    $("#success-alert").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#success-alert").slideUp(1000);
                        $('.successPopup').hide();
                    });
                    trmyteam[settr].style.display = "none";
                    // window.location.href = "/myteam/" + data.message;
                } else if (data.status == "2") {
                    $('#errPopup').show();
                    $('.alert-upload').text(data.message);
                    $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                        $("#errPopup").slideUp(1000);
                        $('#errPopup').hide();
                    });
                }
            }
        }).always(function (data) {
            $('#loading').hide();
        });
    })

    $('#form-adduser').submit(() => {
        if (checkformadduser() == true) {
            $('#myModa-adduser').modal('hide');
            $('#loading').show();
            $.ajax({
                type: "POST",
                url: "/adduser",
                dataType: "json",
                data: {
                    email: $(".textarea-adduser").val(),
                    idApp: $('#idapp-using').val()
                },
                success: (data) => {
                    if (data.status == "1") {
                        window.location.href = "/myteam/" + data.message;
                    } else if (data.status == "2") {
                        $('#errPopup').show();
                        $('.alert-upload').text(data.message);
                        $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                            $("#errPopup").slideUp(1000);
                            $('#errPopup').hide();
                        });
                    }
                }
            }).always(function (data) {
                $('#loading').hide();
            });
        }
    })

})