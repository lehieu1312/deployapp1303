let sss = document.getElementById("chart-session").getContext("2d")

let sessionsystem = new Chart(sss, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: ['Ios', 'Android'],
        datasets: [{
            label: 'Population',
            data: [
                61,
                18
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
        // tooltips: {
        //     enabled: false,
        //     mode: 'label',
        //     position: 'average',
        //     custom: function (tooltip) {

        //         console.log(this.text);
        //         if (!tooltip.text) {
        //             return;
        //         }
        //     }
        // },
        cutoutPercentage: 80,
        // elements: {
        //     center: {
        //         text: '100 User active',
        //         color: '#666666', // Default is #000000
        //         // fontStyle: 'Arial', // Default is Arial
        //         // sidePadding: 20
        //     }
        // }
    }

})