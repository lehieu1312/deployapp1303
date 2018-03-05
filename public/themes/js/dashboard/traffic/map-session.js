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
        'https://cdn.anychart.com/samples/maps-general-features/world-choropleth-map/data.json',
        function (data) {
            var map = anychart.map();
            map.title().enabled(false);

            map.geoData('anychart.maps.world');
            map.interactivity().selectionMode('none');
            map.padding(0);

            var dataSet = anychart.data.set(data);
            var density_data = dataSet.mapAs({
                'value': 'density'
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
                    return '<span style="color: #d9d9d9">Density</span>: ' +
                        parseFloat(this.value).toLocaleString() + ' pop./km&#178 <br/>' +
                        '<span style="color: #d9d9d9">Population</span>: ' +
                        parseInt(this.getData('population')).toLocaleString() + '<br/>' +
                        '<span style="color: #d9d9d9">Area</span>: ' +
                        parseInt(this.getData('area')).toLocaleString() + ' km&#178';
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