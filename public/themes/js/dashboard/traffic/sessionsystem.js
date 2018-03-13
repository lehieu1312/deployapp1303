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
            let numberandroi = 0;
            let numberios = 0;
            if (data.platform.android.android > 0 || data.platform.ios.ios > 0) {
                numberandroi = (data.platform.android.android * 100 / (data.platform.android.android + data.platform.ios.ios));
                numberios = (data.platform.ios.ios * 100 / (data.platform.android.android + data.platform.ios.ios));
            }
            let centandroid = (numberandroi - data.platform.android.androidall * 100 / (data.platform.android.androidall + data.platform.ios.iosall)).toFixed(1);
            let colorandroid = setstatus(centandroid);
            let centios = (numberios - data.platform.ios.iosall * 100 / (data.platform.android.androidall + data.platform.ios.iosall)).toFixed(1);
            let colorios = setstatus(centandroid);

            $(".system-session").append(` <div class="sub-session-system">
            <span>
                <img src="/themes/img/dashboard/iconios.png">
                <span>Ios</span>
            </span>
            <br>
            <span class="light-large-gray">${numberandroi.toFixed(1) + "%"}</span>
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
            <span class="light-large-gray">${numberios.toFixed(1) + "%"}</span>
            <br>
            <span class="${colorios.color}">
                <img class="settihg-arrow" src="/themes/img/traffic/${colorios.arrow}">${Math.abs(centios) + "%"}
            </span>
        </div>`)

            let sss = document.getElementById("chart-session").getContext("2d")

            let platformAdnroid = 0;
            let platformIos = 0;
            if (data.platform.android.android > 0) {
                platformAdnroid = data.platform.android.android;
            }
            if (data.platform.ios.ios > 0) {
                platformIos = data.platform.ios.ios;
            }
            let sessionsystem = new Chart(sss, {
                type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data: {
                    labels: ['Ios', 'Android'],
                    datasets: [{
                        label: 'Population',
                        data: [
                            platformAdnroid,
                            platformIos
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