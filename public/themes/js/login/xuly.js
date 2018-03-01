var socket = io('http://localhost:3000');
socket.on('user-online', function () {
    $('#accessfuntionlogin').hide();
    $('#accessfuntionlogout').show();
});