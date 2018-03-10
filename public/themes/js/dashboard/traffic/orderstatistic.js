function ajaxorderstatistic(numberdate) {
    let linkstatistic = "/orderstatistic/" + $("#idapp-using").val() + "?numberdate=" + numberdate;
    $.post(
        linkstatistic, {},
        function (data) {
            function getWeekDates() {
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
            }
            var setdate = getWeekDates();
            var datalinetime = {
                labels: setdate,
                datasets: [{
                        label: 'Order',
                        data: data.orderstatistic[0],
                        borderColor: '#f44336',
                        pointBackgroundColor: "#f44336",
                        pointStyle: 'rect',
                        borderWidth: 1,
                        fill: false,
                    }, {
                        label: 'Users',
                        data: data.orderstatistic[1],
                        backgroundColor: '#f2f9ff',
                        borderColor: '#00afee',
                        pointStyle: 'rect',
                        pointBackgroundColor: "#00afee",
                        borderWidth: 1
                    }

                ]
            }
            var customTooltips = function (tooltip) {
                // Tooltip Element
                var tooltipEl = document.getElementById('chartjs-tooltip');
                if (!tooltipEl) {
                    tooltipEl = document.createElement('div');
                    tooltipEl.id = 'chartjs-tooltip';
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
                    // console.log(tooltip.body)
                    var titleLines = tooltip.title || [];
                    var bodyLines = tooltip.body.map(getBody);
                    var innerHtml = '<thead>';
                    titleLines.forEach(function (title) {
                        innerHtml += '<tr><th>' + title + '</th></tr>';
                    });
                    innerHtml += '</thead><tbody>';
                    var imgx = ["cart", "user"];
                    bodyLines.forEach(function (body, i) {
                        var editbody = body[0].split(":")[1];
                        // console.log(editbody);
                        // var colors = tooltip.labelColors[i];
                        // var style = 'background:' + colors.backgroundColor;
                        // style += '; border-color:' + colors.borderColor;
                        // style += '; border-width: 2px';
                        var span = '<span class="chartjs-tooltip-key"><img class="setimgtooltip" src="/themes/img/traffic/' + imgx[i] + '.png"></span>';
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
            let chartlinetime = document.getElementById("linetime").getContext("2d");
            let chartorderstatistics = new Chart(chartlinetime, {
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
                        custom: customTooltips
                    },
                    elements: {
                        point: {
                            hoverRadius: 6,
                            radius: 0,
                            hitRadius: 5
                        }
                    },
                    scales: {
                        xAxes: [{

                            gridLines: {
                                drawOnChartArea: false,
                                // drawBorder: true,
                            },
                            ticks: {
                                min: '20',
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 13
                            },
                            gridLines: {
                                // display: false
                            }
                        }],

                    }
                }
            })



            // document.getElementById('chartjsLegend').innerHTML = chartorderstatistics.generateLegend();
        }

    )
}