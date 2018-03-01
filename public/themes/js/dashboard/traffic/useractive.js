function ajaxuseractive(numberdate) {
    let linkpageuer = "/useractive/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    $.post(
        linkpageuer, {},
        function (user) {
            // console.log(user);
            let textdate = document.getElementsByClassName('number-useractive');
            var datanow = [user.datamonth[0], user.dataweek[0], user.dataday[0]]
            for (let i = 0; i < textdate.length; i++) {
                textdate[i].innerHTML = datanow[i];
            }

            function getWeekDates() {
                // if (numberdate == 7) {
                let now = new Date();
                let dayOfWeek = now.getDay(); //0-6
                let numDay = now.getDate();
                let setdate = [];
                let setarraydate = [];
                for (var i = numberdate; i >= 1; i--) {
                    setarraydate.push(i)
                }

                for (let i = 1; i <= numberdate; i++) {
                    setdate[i - 1] = new Date(now); //copy
                    setdate[i - 1].setDate(numDay - setarraydate[i - 1]);
                    setdate[i - 1].setHours(23, 59, 59, 999);
                    setdate[i - 1] = setdate[i - 1].toDateString().split(" ");
                    setdate[i - 1] = setdate[i - 1][2] + " " + setdate[i - 1][1];
                }
                return setdate;
                // } else {
                //     let now = new Date();
                //     let dayOfWeek = now.getDay(); //0-6
                //     let numDay = now.getDate();
                //     let setdate = [];
                //     let setarraydate = [];
                //     for (var i = numberdate; i >= 0; i = i - (numberdate / 6)) {
                //         if (i == 0) {
                //             setarraydate.push(1)
                //         } else {
                //             setarraydate.push(i)
                //         }

                //     }
                //     let j = 0;
                //     console.log(setarraydate)
                //     for (let i = 0; i < numberdate; i++) {

                //         if (i % (numberdate / 6) == 0) {
                //             setdate[i] = new Date(now); //copy
                //             setdate[i].setDate(numDay - setarraydate[j]);
                //             setdate[i].setHours(23, 59, 59, 999);
                //             setdate[i] = setdate[i].toDateString().split(" ");
                //             setdate[i] = setdate[i][2] + " " + setdate[i][1];
                //             j++;
                //         } else {
                //             if (i == 29) {
                //                 setdate[i] = new Date(now); //copy
                //                 setdate[i].setDate(numDay - setarraydate[j]);
                //                 setdate[i].setHours(23, 59, 59, 999);
                //                 setdate[i] = setdate[i].toDateString().split(" ");
                //                 setdate[i] = setdate[i][2] + " " + setdate[i][1];
                //                 j++;
                //             } else {
                //                 setdate[i] = "";
                //             }
                //         }


                //     }
                //     return setdate;
                // }
            }
            var label = getWeekDates();
            var datalinetime = {
                labels: label,
                datasets: [{
                    label: 'Monthly',
                    data: user.datamonth.reverse(),
                    borderColor: '#3367d6',
                    pointBackgroundColor: "#3367d6",
                    pointStyle: 'rect',
                    borderWidth: 1,
                    fill: false,

                }, {
                    // showLine: false,
                    label: 'weekly',
                    data: user.dataweek.reverse(),
                    borderColor: '#4285f4',
                    pointStyle: 'rect',
                    pointBackgroundColor: "#4285f4",
                    borderWidth: 1,
                    fill: false,

                }, {
                    // showLine: false,
                    label: 'daily',
                    data: user.dataday.reverse(),
                    borderColor: '#7baaf7',
                    pointStyle: 'rect',
                    pointBackgroundColor: "#7baaf7",
                    borderWidth: 1,
                    fill: false,
                    tooltip: false,
                    stepped: true
                }, ]
            }
            var customTooltipsuser = function (tooltip, data) {

                var tooltipEl = document.getElementById('tooltip-user-active');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'tooltip-user-active';
                    tooltipEl.innerHTML = "<table></table>";
                    this._chart.canvas.parentNode.appendChild(tooltipEl);
                }
                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                }
                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltip.yAlign) {
                    tooltipEl.classList.add(tooltip.yAlign);
                } else {
                    tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                    return bodyItem.lines;
                }
                // Set Text
                if (tooltip.body) {
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);
                    var innerHtml = '<thead>';
                    titleLines.forEach(function (title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';
                    var imgxx = ["iconmonth", "iconweed", "iconday"]
                    bodyLines.forEach(function (body, i) {
                        // console.log("body:" + body[i])
                        var editbody = body[0].split(":")[1];

                        var span = '<span class="tooltip-user-active-key"><img class="setimgtooltip" src="/themes/img/traffic/' + imgxx[i] + '.png"></span>';
                        innerHtml += '<tr><td>' + span + editbody + '</td></tr>';
                    });
                    innerHtml += '</tbody>';
                    var tableRoot = tooltipEl.querySelector('table');
                    tableRoot.innerHTML = innerHtml;
                }
                var positionY = this._chart.canvas.offsetTop;
                var positionX = this._chart.canvas.offsetLeft;
                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.left = positionX + tooltip.caretX + 'px';
                tooltipEl.style.top = positionY + tooltip.caretY + 'px';
                tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
                tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
                tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
            };
            let uat = document.getElementById("user-active-canvas").getContext("2d");
            let useractive = new Chart(uat, {
                type: 'line',
                data: datalinetime,
                options: {
                    responsive: true,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                        mode: 'index',
                        position: 'nearest',
                        custom: customTooltipsuser,
                    },
                    elements: {
                        line: {
                            tension: 0, // disables bezier curves
                        },
                        point: {
                            hoverRadius: 5,
                            radius: 0,
                            hitRadius: 5
                        }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: {
                                drawOnChartArea: false,
                            },
                            ticks: {
                                beginAtZero: true,
                                fontFamily: ' OpenSans-Regular',
                                fontSize: 13,
                                min: 0,
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {

                                beginAtZero: true,
                                fontFamily: ' OpenSans-Regular',
                                fontSize: 13,
                                // stepSize: 50

                            },
                            gridLines: {
                                // display: false
                            }
                        }]
                    },

                    label: {
                        font: {
                            family: "Georgia"
                        }
                    },

                }
            })
        }
    )
}
$(document).ready(() => {
    ajaxuseractive(7);
    clickmenu(3, ajaxuseractive)
})