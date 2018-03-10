function setstatus(a) {
    let coloruser = {};
    if (a > 0) {
        coloruser = {
            color: "background-green",
            arrow: "iconarrowup.png"
        }
    } else {
        coloruser = {
            color: "background-red",
            arrow: "iconarrowunder.png"
        }
    }
    return coloruser;
}

function ajaxstatistic(numberdate, numberend) {
    if (numberdate == 0) {
        numberdate = 1;
    }
    let linkstatistic;
    if (numberend == 0) {
        linkstatistic = "/statisticstracking/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    } else {
        linkstatistic = "/statisticstracking/" + $("#idapp-using").val() + "?numberdate=" + numberdate + "&numberend=" + numberend;
    }
    // console.log(linkstatistic);
    $.post(linkstatistic, {},
        (data) => {
            if (numberdate > data.date) {
                numberdate = data.date;
            }
            $(".statistic-tracking").html("");
            let centuser = ((data.user.getuser / numberdate) / (data.user.getuserall / data.date) - 1).toFixed(1);

            let centsession = ((data.session.getsession / numberdate) / (data.session.getsessionall / data.date) - 1).toFixed(1);

            let centrate = 0;

            let getrate = 0;

            if (data.bouncerate.bouncerate == 0) {
                getrate = 0;
                centrate = (0 - (data.bouncerate.bouncerateall * 100 / data.session.getsessionall)).toFixed(1);
            } else {
                getrate = (data.bouncerate.bouncerate * 100 / data.session.getsession).toFixed(1);
                centrate = ((data.bouncerate.bouncerate * 100 / data.session.getsession) - (data.bouncerate.bouncerateall * 100 / data.session.getsessionall)).toFixed(1);
            }

            let centsessiontime = ((data.sessiontime.sessiontime / numberdate) / (data.sessiontime.sessiontimeall / data.date) - 1).toFixed(1);

            let coloruser = setstatus(centuser);

            let colorsession = setstatus(centsession);

            let colorrate = setstatus(centrate);


            let colorsessiontime = setstatus(centsessiontime);
            $(".statistic-tracking").append(`
            <div class="footer-content-statistics">
            <span class="regular-medium-gray">Users</span>
            <br>
            <span class="light-large-gray">${data.user.getuser}</span>
            <br>
            <span class="${coloruser.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${coloruser.arrow}">${(Math.abs(centuser*100)).toFixed(0) + "%"}
            </span>
        </div>
        <div class="footer-content-statistics">
            <span class="regular-medium-gray">Sessions</span>
            <br>
            <span class="light-large-gray">${data.session.getsession}</span>
            <br>
            <span class="${colorsession.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorsession.arrow}">${(Math.abs(centsession*100)).toFixed(0) + "%"}</span>
        </div>
        <div class="footer-content-statistics">
            <span class="regular-medium-gray">Bounce Rate</span>
            <br>
            <span class="light-large-gray">${getrate + "%"}</span>
            <br>
            <span class="${colorrate.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorrate.arrow}">${Math.abs(centrate) + "%"}</span>
        </div>
        <div class="footer-content-statistics">
            <span class="regular-medium-gray">Session Duration</span>
            <br>
            <span class="light-large-gray">${settime(data.sessiontime.sessiontime)}</span>
            <br>
            <span class="${colorsessiontime.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorsessiontime.arrow}">${(Math.abs(centsessiontime*100)).toFixed(0) + "%"}</span>
        </div>`)
        }
    )
}