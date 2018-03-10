function ajaxsss(numberdate, numberend) {
    if (numberdate == 0) {
        numberdate = 1;
    }
    let linkstatistic;
    if (numberend == 0) {
        linkstatistic = "/statisticstracking/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    } else {
        linkstatistic = "/statisticstracking/" + $("#idapp-using").val() + "?numberdate=" + numberdate + "&numberend=" + numberend;
    }
    $.post(linkstatistic, {},
        (data) => {
            // console.log(data)
            $(".system-session").html("");
            let centandroid = (data.platform.android.android * 100 / (data.platform.android.android + data.platform.ios.ios) - data.platform.android.androidall * 100 / (data.platform.android.androidall + data.platform.ios.iosall)).toFixed(1);
            let colorandroid = setstatus(centandroid);
            let centios = (data.platform.ios.ios * 100 / (data.platform.android.android + data.platform.ios.ios) - data.platform.ios.iosall * 100 / (data.platform.android.androidall + data.platform.ios.iosall)).toFixed(1);
            let colorios = setstatus(centandroid);

            $(".system-session").append(` <div class="sub-session-system">
            <span>
                <img src="/themes/img/dashboard/iconios.png">
                <span>Ios</span>
            </span>
            <br>
            <span class="light-large-gray">${(data.platform.android.android * 100 / (data.platform.android.android + data.platform.ios.ios)).toFixed(1) + "%"}</span>
            <br>
            <span class="${colorandroid.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorandroid.arrow}">${Math.abs(centandroid)+"%"}
            </span>
        </div>
        <div class="sub-session-system">
            <span>
                <img src="/themes/img/dashboard/iconandroid.png">
                <span>Android</span>
            </span>
            <br>
            <span class="light-large-gray">${(data.platform.ios.ios * 100 / (data.platform.android.android + data.platform.ios.ios)).toFixed(1) + "%"}</span>
            <br>
            <span class="${colorios.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorios.arrow}">${Math.abs(centios) + "%"}
            </span>
        </div>`)

            let sss = document.getElementById("chart-session").getContext("2d")

            let sessionsystem = new Chart(sss, {
                type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data: {
                    labels: ['Ios', 'Android'],
                    datasets: [{
                        label: 'Population',
                        data: [
                            data.platform.android.android,
                            data.platform.ios.ios
                        ],
                        //backgroundColor:'green',
                        backgroundColor: [
                            '#00afee',
                            '#90d7ed',
                        ],
                        borderWidth: 1

                    }]
                },
                options: {
                    title: {
                        display: false,
                    },
                    legend: {
                        display: false,
                    },
                    cutoutPercentage: 80,

                }

            })
        }
    )
}