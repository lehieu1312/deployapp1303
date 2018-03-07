$(document).ready(() => {
    ajaxpageuser(7, 0);
    clickmenu(1, ajaxpageuser);
})

function settime(a) {
    return Math.floor(a / 60000) + "m" + (a % 60000 / 1000).toFixed(0) + "s";
}

function ajaxpageuser(numberdate, numberend) {
    let linkpageuer;
    if (numberend == 0) {
        linkpageuer = "/pageuser/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    } else {
        linkpageuer = "/pageuser/" + $("#idapp-using").val() + "?numberdate=" + numberdate + "&numberend=" + numberend;
    }
    $.post(
        linkpageuer, {},
        function (data) {
            $("#body-table-pageuser").html("");
            for (let i = 0; i < data.pageuser.length; i++) {
                console.log(data.pageuser[i].quantily)
                if (i == data.pageuser.length - 1) {
                    $("#body-table-pageuser").append(
                        `<tr class="border-botton-none ">
                    <td width="57.2% ">${data.pageuser[i].pageAccess}</td>
                    <td width="15.4% ">${data.pageuser[i].quantily + ""}</td>
                    <td width="15% ">${settime(data.pageuser[i].accessTime)}</td>
                    <td width="14.6% ">${settime(data.pageuser[i].averageTime)}</td>
                    </tr>`);
                } else {
                    $("#body-table-pageuser").append(
                        ` <tr>
                    <td width="57.2% ">${data.pageuser[i].pageAccess}</td>
                    <td width="15.4% ">${data.pageuser[i].quantily}</td>
                    <td width="15% ">${settime(data.pageuser[i].accessTime)}</td>
                    <td width="14.6% ">${settime(data.pageuser[i].averageTime)}</td>
                    </tr>`);
                }

            }
        }
    )
}