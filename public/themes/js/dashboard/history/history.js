$(document).ready(() => {
    // $('#text-href').text("History");

    function trimSpace(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ");
    }
    var idApp;
    var version;
    var writenote = document.getElementsByClassName("write-note");
    var spannote = document.getElementsByClassName("note-table-history")
    // console.log(spannote[0].innerHTML)
    for (let i = 0; i < $(".tr-content-appversion").length; i++) {
        writenote[i].addEventListener('click', () => {
            idApp = $('#history-app').val();
            version = trimSpace(document.getElementsByClassName("table-version")[i].innerHTML);
            $('.textarea-history').val("");
            $('.textarea-history').val(trimSpace(spannote[i].innerHTML))
        })
    }

    // $('#cancel-histoty').click(() => {
    //     $(".textarea-history").val("")
    // })
    $('#form-note-history').submit(() => {
        $('#loading').show();
        $.ajax({
            type: "POST",
            url: "/getnotehistory",
            dataType: "json",
            data: {
                note: trimSpace($(".textarea-history").val()),
                idApp,
                version
            },
            success: (data) => {
                if (data.status == "1") {
                    window.location.href = "/History/" + data.message;
                }
            }
        }).always(function (data) {
            // $(".textarea-history").val("")
            $('#loading').hide();
        });
    })
})