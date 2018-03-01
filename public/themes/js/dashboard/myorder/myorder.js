$(document).ready(() => {
    // $('#text-href').text("My Order");
    // var arrowselect = document.getElementsByClassName("arrowselecsattus");
    // var status = document.getElementsByClassName("paddingstatus");
    // $('.arrowselecsattus').each((i) => {
    //     $(this).click(() => {
    //         alert($(this).text())
    //     })
    // })
    // for (let i = 0; i < status.length; i++) {
    //     status[i].addEventListener("click", () => {

    //         console.log("pageX:" + arrowselect[i].pageX)
    //         console.log("pageY:" + arrowselect[i].pageY)
    //     })
    // }

    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");
    var emaildelete = document.getElementsByClassName("text-email");
    var email;
    for (let i = 0; i < $('.deleteuser').length; i++) {
        btndelete[i].addEventListener('click', (event) => {
            if (deleteuser[i].style.display === "none") {
                deleteuser[i].style.display = "block";
            } else {
                deleteuser[i].style.display = "none";
            }
            event.stopPropagation();
        })
    }
    $(body).click(() => {
        $('.delete-user').hide();
    })

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }

    var codeOrder;
    var setstatuspaypent;
    var statuspayment = document.getElementsByClassName("statuspayment");
    var getstatuspayment = document.getElementsByClassName("getstatuspayment");
    var getcodeorder = document.getElementsByClassName("getcodeorder");
    var ul = document.getElementsByClassName("selectstatuspayment");
    var textstatus = document.getElementsByClassName("textstatus")

    for (let i = 0; i < statuspayment.length; i++) {
        statuspayment[i].addEventListener("click", () => {
            codeOrder = trimSpace(getcodeorder[i].value)

        });
        btndelete[i].addEventListener('click', () => {
            codeOrder = trimSpace(getcodeorder[i].value)
            console.log(codeOrder)
        })
    }
    for (let i = 0; i < ul.length; i++) {
        var li = ul[i].getElementsByTagName("li")
        var a = ul[i].getElementsByTagName("a")
        for (let j = 0; j < li.length; j++) {
            li[j].addEventListener("click", () => {
                if (j == 0) {
                    statuspayment[i].style.background = "#4169e1"
                }
                if (j == 1) {
                    statuspayment[i].style.background = "#ff8c00"
                }
                if (j == 2) {
                    statuspayment[i].style.background = "#919191"
                }
                if (j == 3) {
                    statuspayment[i].style.background = "#32cd32"
                }
                if (j == 4) {
                    statuspayment[i].style.background = "#dc143c"
                }
                if (j == 5) {
                    statuspayment[i].style.background = "#ec2e15"
                }
                if (j == 6) {
                    statuspayment[i].style.background = "#8f0621"
                }
                setstatuspaypent = Number(li[j].value)
                $('#loading').show();
                // console.log(i)
                $.ajax({
                    type: "POST",
                    url: "/changestatuspayment",
                    dataType: "json",
                    data: {
                        codeOrder,
                        setstatuspaypent,
                        idApp: $("#idapp-using").val()
                    },
                    success: (data) => {
                        if (data.status == "1") {
                            textstatus[i].innerHTML = a[j].innerHTML
                        }
                        // else if (data.status == "2") {
                        //     $('#myModal').modal('hide');
                        //     $('#errPopup').show();
                        //     $('.alert-upload').text(data.message);
                        //     $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                        //         $("#errPopup").slideUp(1000);
                        //         $('#errPopup').hide();
                        //     });
                        // }
                    }
                }).always(function (data) {
                    $('#loading').hide();
                });
            });
        }
    }

    var btndelete = document.getElementsByClassName("deleteuser");
    var deleteuser = document.getElementsByClassName("delete-user");
    var elementdelete = document.getElementsByClassName("element-delete");

    $('#delete-ok').click(() => {
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/deleteorder",
            dataType: "json",
            data: {
                codeOrder,
                idApp: $('#idapp-using').val()
            },
            success: (data) => {
                if (data.status == "1") {
                    window.location.href = "/myorder/" + data.message;
                }
            }
        }).always(function (data) {
            // $(".textarea-history").val("")
            $('#loading').hide();
        });
    })

})