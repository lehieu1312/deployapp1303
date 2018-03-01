exports = module.exports = function(io) {
    // Set socket.io listeners.
    io.on('connection', (socket) => {
        socket.on("send-app-length", (data => {
                var apponline = [];
                for (var i = 0; i < data; i++) {
                    apponline[i] = Math.floor(Math.random() * 100) + 101;
                }
                io.to(socket.id).emit("sever-app-online", apponline);
                setInterval(() => {
                    io.to(socket.id).emit("sever-app-online", apponline);
                    for (var j = 0; j < apponline.length; j++) {
                        apponline[j]++;
                    }
                    // console.log(apponline);
                }, 5000)
            }))
            //console.log('a user connected');

    });
}