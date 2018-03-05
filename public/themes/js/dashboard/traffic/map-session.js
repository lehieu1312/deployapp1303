// google.charts.load('current', {
//     'packages': ['geochart'],
//     // Note: you will need to get a mapsApiKey for your project.
//     // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
//     'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
// });
// google.charts.setOnLoadCallback(drawRegionsMap);

// function drawRegionsMap() {
//     var data = google.visualization.arrayToDataTable([
//         ['Country', 'User'],
//         ['Germany', 200],
//         ['United States', 300],
//         ['Brazil', 400],
//         ['Canada', 500],
//         ['France', 600],
//         ['RU', 700],
//         ['VN', 1000]
//     ]);

//     var options = {
//         legend: 'none',
//         keepAspectRatio: true,
//         region: 'world',
//         enableRegionInteractivity: 'true',
//         colorAxis: {
//             colors: ['#00afee']
//         },
//         tooltip: {
//             textStyle: {
//                 color: '#444444'
//             }
//         }
//     };

//     var chart = new google.visualization.GeoChart(document.getElementById('map-session-country'));

//     chart.draw(data, options);
// }
$(document).ready(() => {
    $(".anychart-credits").hide();
})
anychart.onDocumentReady(function () {
    anychart.data.loadJsonFile(
        hostSeverSocket + '/sessioncountry/app1',
        function (data) {
            var userall = 0;;
            for (let i = 0; i < data.length; i++) {
                userall = userall + data[i].user;
            }
            if (data.length > 4) {
                let htmlcountry = "";
                for (let i = 0; i < 4; i++) {
                    let number = data[i].user * 100 / userall;
                    htmlcountry += `<div>
                    <span>${data[i].name}</span>
                    <span class="float-right">${number.toFixed(0) + "%"}</span>
                    <div class="progress-map">
                        <div class="progress-bar color-progress" style="width:${number.toFixed(0) +"%"}">
                            <span class="sr-only">${number.toFixed(0) +"%"} Complete</span>
                        </div>
                    </div>`;
                }
                $(".br-session").after(htmlcountry)
            } else {
                let htmlcountry = "";
                for (let i = 0; i < data.length; i++) {
                    let number = data[i].user * 100 / userall;
                    htmlcountry += `<div>
                    <span>${data[i].name}</span>
                    <span class="float-right">${number.toFixed(0) + "%"}</span>
                    <div class="progress-map">
                        <div class="progress-bar color-progress" style="width:${number.toFixed(0) +"%"}">
                            <span class="sr-only">${number.toFixed(0) +"%"} Complete</span>
                        </div>
                    </div>`;
                }
                $(".br-session").after(htmlcountry)
            }

            var map = anychart.map();
            map.title().enabled(false);

            map.geoData('anychart.maps.world');
            map.interactivity().selectionMode('none');
            map.padding(0);

            var dataSet = anychart.data.set(data);
            var density_data = dataSet.mapAs({
                'value': 'user'
            });
            var series = map.choropleth(density_data);

            series.labels(false);

            series.hovered()
                .fill('#f48fb1')
                .stroke(anychart.color.darken('#f48fb1'));

            series.selected()
                .fill('#c2185b')
                .stroke(anychart.color.darken('#c2185b'));

            series.tooltip()
                .useHtml(true)
                .format(function () {
                    return '<span style="color: #d9d9d9">User</span>: ' +
                        parseInt(this.getData('user')).toLocaleString() + '<br/>';
                });

            var scale = anychart.scales.ordinalColor([{
                    less: 10
                },
                {
                    from: 10,
                    to: 30
                },
                {
                    from: 30,
                    to: 50
                },
                {
                    from: 50,
                    to: 100
                },
                {
                    from: 100,
                    to: 200
                },
                {
                    from: 200,
                    to: 300
                },
                {
                    from: 300,
                    to: 500
                },
                {
                    from: 500,
                    to: 1000
                },
                {
                    greater: 1000
                }
            ]);
            scale.colors(['#81d4fa', '#4fc3f7', '#29b6f6', '#039be5', '#0288d1', '#0277bd',
                '#01579b', '#014377', '#000000'
            ]);

            var colorRange = map.colorRange();
            colorRange.enabled(false)
                .padding([0, 0, 20, 0]);
            colorRange.ticks()
                .enabled(false)
                .stroke('3 #ffffff')
                .position('center')
                .length(7);
            colorRange.colorLineSize(5);
            colorRange.marker().size(7);
            colorRange.labels()
                .fontSize(11)
                .padding(3, 0, 0, 0)
                .format(function () {
                    var range = this.colorRange;
                    var name;
                    if (isFinite(range.start + range.end)) {
                        name = range.start + ' - ' + range.end;
                    } else if (isFinite(range.start)) {
                        name = 'More than ' + range.start;
                    } else {
                        name = 'Less than ' + range.end;
                    }
                    return name
                });

            series.colorScale(scale);

            // create zoom controls
            var zoomController = anychart.ui.zoom();
            zoomController.render(map);

            // set container id for the chart
            map.container('map-session-country');
            // initiate chart drawing
            map.draw();
        });
});