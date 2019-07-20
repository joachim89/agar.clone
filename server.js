//OLD:
const http = require('http')
const app = require('./app.js')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server)


let serverPlayers = {};
//Server.listen(PORT, () => console.log('Game server running on:', PORT))
Server.listen(PORT, () => console.log("\x1b[33m%s\x1b[0m", "Server started at port " + "\x1b[31m" + PORT));


io.on('connection', function (socket) {
   
    console.log('a user connected', socket.id);
    socket.on('disconnect', function () {
        
        console.log('user disconnected', socket.id);
        delete serverPlayers[socket.id];
    });
    socket.on('send player', function (message) {
       // console.log(socket.id, " sier ", message);

        serverPlayers[socket.id] = message;
        
        
    });
    socket.on('view data', function(){
        console.log("\x1b[31m\nSHOWING ALL DATA IN PLAYERS ARRAY: \n","\x1b[37m", serverPlayers);

    });
    socket.on('update players', function(){
        io.emit('update players', serverPlayers);
    });
    
});

