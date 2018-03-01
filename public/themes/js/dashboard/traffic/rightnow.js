$(document).ready(() => {
    var linkstatistic = "/rightnow/" + $("#idapp-using").val();
    $.post(
        linkstatistic, {},
        function (data) {
            let rgtn = document.getElementById("chart-rightnow").getContext("2d")
            let rightnow = new Chart(rgtn, {
                type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
                data: {
                    labels: ['Ios', 'Android'],
                    datasets: [{
                        label: 'Population',
                        data: [
                            data.android,
                            data.ios
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
                    tooltip: {
                        enabled: false,
                        // display: false
                    },
                    cutoutPercentage: 83,
                    elements: {
                        center: {
                            text: data.android + data.ios,
                            color: '#444459', // Default is #000000
                            // fontStyle: 'Arial', // Default is Arial
                            // sidePadding: 20
                        }
                    }
                }

            })
            Chart.pluginService.register({
                beforeDraw: function () {
                    if (rightnow.config.options.elements.center) {
                        var ctx = rightnow.chart.ctx;

                        var centerConfig = rightnow.config.options.elements.center;
                        var fontStyle = centerConfig.fontStyle || 'OpenSans-Regular';
                        var txt = centerConfig.text;
                        var color = centerConfig.color || '#000';
                        var sidePadding = centerConfig.sidePadding || 20;
                        var sidePaddingCalculated = (sidePadding / 100) * (rightnow.innerRadius * 2)

                        ctx.font = "65px " + fontStyle;


                        var stringWidth = ctx.measureText(txt).width;
                        var elementWidth = (rightnow.innerRadius * 2) - sidePaddingCalculated;

                        var widthRatio = elementWidth / stringWidth;
                        var newFontSize = Math.floor(30 * widthRatio);
                        var elementHeight = (rightnow.innerRadius * 2);

                        var fontSizeToUse = Math.min(newFontSize, elementHeight);

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        var centerX = ((rightnow.chartArea.left + rightnow.chartArea.right) / 2);
                        var centerY = ((rightnow.chartArea.top + rightnow.chartArea.bottom) / 2.1);
                        ctx.font = fontSizeToUse + "px " + fontStyle;
                        ctx.fillStyle = color;

                        ctx.fillText(txt, centerX, centerY);
                        ctx.font = "13px " + fontStyle;
                        var centerX1 = ((rightnow.chartArea.left + rightnow.chartArea.right) / 2);
                        var centerY1 = ((rightnow.chartArea.top + rightnow.chartArea.bottom) / 1.6);
                        ctx.fillText("User active", centerX1, centerY1);
                    }
                }
            });
            var numberandroid = Math.round(data.android / (data.android + data.ios) * 100);
            var numberios = Math.round(data.ios / (data.android + data.ios) * 100);
            $(".set-Percent-android").text(numberandroid + "%");
            $(".set-Percent-ios").text(numberios + "%");
            $(".quantily-ios").text(data.ios);
            $(".quantily-android").text(data.android);
            for (let i = data.page.length - 1; i >= 0; i--) {
                $("#page-rightnow").append(
                    `
                    <div class="content-page-active">
                    <span>${data.page[i].pageAccess}</span>
                    <span class="float-right">
                        <span>${data.page[i].quantily}</span>
                        <img class="setimg-rightnow" src="/themes/img/traffic/user.png">
                    </span>
                     </div>
                    `
                )
            }
        })
})