var socket = io(hostSeverSocket);
// var socket = io("http://dev.deployapp.net");
$(document).ready(() => {
    $('#submenuleft').hide();
    socket.emit("send-app-length", $(".div-list-myapp").length);
    var a = document.getElementsByClassName('tag-a-app');
    var idapp = document.getElementsByClassName('input-idapp-hide');
    var nameapp = document.getElementsByClassName('input-nameapp-hide');
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener("click", () => {
            $('#tag-a-appversion').attr("href", "/appversion?app=" + idapp[i].value);
        })
    }
    $("#text-href").text("My app")
    $("#deploy-detail-content").click(() => {
        $(".delete-menumore").hide();
    })
    if ($(".div-list-myapp").length < 6) {
        $('.iconloadmore').hide();
        $('#text-showing-myapp').text($(".div-list-myapp").length)
    }

    var number = 6;
    $('#loadmore').click(() => {
        number = number + 2;
    });
    for (var i = 0; i <= $(".div-list-myapp").length; i++) {
        (function (j) {
            $('img[id=' + j + ']').click((event) => {
                $('div[id=' + j + ']').toggle();
                event.stopPropagation();
            })
        })(i);
        (function (j) {
            $('div[id=' + j + ']').click((event) => {
                var idApp = $('.idapp-use' + j).val();
                $('#delete-ok').click(() => {
                    // $('#loading').show();
                    $.ajax({
                        type: "POST",
                        url: "/deleteapp",
                        dataType: "json",
                        data: {
                            idApp
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
                                $('#myModal').modal('hide');
                                $('div[id=app' + j + ']').fadeOut(1000, function () {
                                    $(this).remove();
                                });
                                event.stopPropagation();
                            } else if (data.status == "2") {
                                $('#myModal').modal('hide');
                                $('#errPopup').show();
                                $('.alert-upload').text(data.message);
                                $("#errPopup").fadeTo(5000, 1000).slideUp(1000, function () {
                                    $("#errPopup").slideUp(1000);
                                    $('#errPopup').hide();
                                });
                            }
                        }
                    })
                    // .always(function (data) {
                    //     $('#loading').hide();
                    // });
                })

            })
        })(i);
        (function (j) {
            if (j >= number) {
                $('div[id=app' + j + ']').hide();
            }
        })(i);
        (function (j) {
            $('#loadmore').click(() => {
                if (j <= number) {
                    $('div[id=app' + j + ']').show();
                } else {
                    $('div[id=app' + j + ']').hide();
                }
                if (number >= $(".div-list-myapp").length) {
                    $('.iconloadmore').hide();
                }
            });
        })(i);
    }


})

socket.on("server-send-user-online", (data) => {
    $(".userapponline" + data.idApp).html('');
    $(".userapponline" + data.idApp).html(data.userOnline)
})