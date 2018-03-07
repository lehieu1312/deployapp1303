function setdateproduct(a) {
    let dem = 0;
    for (let i = 0; i < a.length; i++) {
        if (!a[i].dateOutSession) {
            dem = dem + 0;
        } else {
            dem = dem + a[i].dateOutSession;
        }
    }
    return Math.floor((dem / a.length) / 60000) + "m" + ((dem / a.length) % 60000 / 1000) + "s";
}

function order(a) {
    let dem = 0;
    for (let i = 0; i < a.length; i++) {
        dem = dem + a[i].product[0].quantity;
    }
    return dem;
}

function ajaxproduct(numberdate, numberend) {
    let linkproduct;
    if (numberend == 0) {
        linkproduct = "/productstatistic/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    } else {
        linkproduct = "/productstatistic/" + $("#idapp-using").val() + "?numberdate=" + numberdate + "&numberend=" + numberend;
    }
    $.post(linkproduct, {},
        (data) => {
            // console.log(data.order[0][0].product[0].quantity)
            $("#content-productstatictis").html("");
            for (let i = 0; i < data.setdata.length; i++) {
                if (i == data.setdata.length - 1) {
                    $("#content-productstatictis").append(
                        ` <tr class="border-botton-none">
                        <td width="10% ">
                            <a class="colora ">${data.setdata[i][0].idProduct}</a>
                        </td>
                        <td width="46% " style="padding-right: 30px ">
                            <div width="20% " class="floatleft ">
                                <img class=" set-img-produc-trafic " src="/themes/img/productorder/${data.setdata[i][0].image}">
                            </div>
                            <div width="80% " class=" ">
                                <span>${data.setdata[i][0].name}</span>
                            </div>
                        </td>
                        <td width="13% ">${data.setdata[i].length}</td>
                        <td width="14% ">${setdateproduct(data.setdata[i])}</td>
                        <td width="7% ">${order(data.order[i])}</td>
                        <td width=" ">${order(data.orderall[i])}</td>
                    </tr>`
                    )
                } else {
                    $("#content-productstatictis").append(
                        ` <tr>
                            <td width="10% ">
                            <a class="colora ">${data.setdata[i][0].idProduct}</a>
                        </td>
                        <td width="46% " style="padding-right: 30px ">
                            <div width="20% " class="floatleft ">
                                <img class=" set-img-produc-trafic " src="/themes/img/productorder/${data.setdata[i][0].image}">
                            </div>
                            <div width="80% " class=" ">
                                <span>${data.setdata[i][0].name}</span>
                            </div>
                        </td>
                        <td width="13% ">${data.setdata[i].length}</td>
                        <td width="14% ">${setdateproduct(data.setdata[i])}</td>
                        <td width="7% ">${order(data.order[i])}</td>
                        <td width=" ">${order(data.orderall[i])}</td>
                    </tr>`
                    )
                }
            }
        }
    )
}

$(document).ready(() => {
    ajaxproduct(7, 0);
    clickmenu(2, ajaxproduct);
})