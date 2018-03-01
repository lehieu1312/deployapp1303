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

function ajaxproduct(numberdate) {
    let linkstatistic = "/productstatistic/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    $.post(linkstatistic, {},
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
    ajaxproduct(7);
    clickmenu(2, ajaxproduct);
    // let menupageuser = document.getElementsByClassName("myDropdown-traffic")[2];
    // let selected = document.getElementsByClassName("selected-date")[2];
    // let tagapageuser = menupageuser.getElementsByTagName("a");
    // // for (let i = 0; i < tagapageuser.length; i++) {
    // tagapageuser[0].addEventListener('click', () => {
    //     selected.innerHTML = "ToDay";
    //     ajaxproduct(0);
    // })
    // tagapageuser[1].addEventListener('click', () => {
    //     selected.innerHTML = "Yesterday";
    //     ajaxproduct(1);
    // })
    // tagapageuser[2].addEventListener('click', () => {
    //     selected.innerHTML = "Last 7 days";
    //     ajaxproduct(7);
    // })
    // tagapageuser[3].addEventListener('click', () => {
    //     selected.innerHTML = "Last 30 days";
    //     ajaxproduct(30);
    // })
    // tagapageuser[4].addEventListener('click', () => {
    //     selected.innerHTML = "Last 90 days";
    //     ajaxproduct(90);
    // })
    // tagapageuser[5].addEventListener('click', () => {
    //     ajaxproduct(1);
    // })
})