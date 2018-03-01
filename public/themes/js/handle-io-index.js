var socket = io('https://deployapp.net');
// var socketclient = io('http://localhost:3000');
// /http://104.238.165.113/
// hostServer
socket.on('Server-send-data-uploaded', function(data) {
    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
    $('#numUpload').animateNumber({
        number: data.clUploaded,
        numberStep: comma_separator_number_step
    });
});

socket.on('Server-send-data-deployed', function(data) {
    var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
    $('#numDeploy').animateNumber({
        number: data.clDeployed,
        numberStep: comma_separator_number_step
    });
    $('#numRegister').animateNumber({
        number: data.clRegister,
        numberStep: comma_separator_number_step
    });

});

// socketclient.on('server-send-user-online', function(data) {
//     console.log(data);
//     // var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
//     // $('#number-notification').animateNumber({
//     //     number: data.userOnline,
//     //     numberStep: comma_separator_number_step
//     // });
// });