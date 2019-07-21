//OLD:
const http = require('http')
const app = require('./app.js')
const Server = http.Server(app)
const PORT = process.env.PORT || 8000
const io = require('socket.io')(Server)

//SPILLTING:
let serverPlayers = {};
let history = [getTime() + ": Server started"];
let connectCounter = 0;

let apples = [];
let nrApples = 30;
for (i = 0; i < nrApples; i++) {
    var apple = { nr: i, x: Math.random() * 2000, y: Math.random() * 2000 };
    apples.push(apple);
}




//Server.listen(PORT, () => console.log('Game server running on:', PORT))
Server.listen(PORT, () => console.log("\x1b[33m%s\x1b[0m", "Server started at port " + "\x1b[31m" + PORT));
console.log(apples.length + " apples spawned");
addHistory(apples.length + " apples spawned");

io.on('connection', function (socket) {
    console.log('\x1b[32ma user connected', socket.id, "\x1b[37m total connections: ", connectCounter);
    io.emit('history', { history });
    io.emit('total players', { connectCounter });


    socket.on('disconnect', function () {
        console.log('\x1b[31muser disconnected', socket.id, "\x1b[37m total connections: ", connectCounter);
        if (typeof serverPlayers[socket.id] != "undefined") {
            addHistory(serverPlayers[socket.id].name + " left the game.");
            if (connectCounter > 0) { connectCounter--; }
        }
        io.emit('total players', { connectCounter });
        delete serverPlayers[socket.id];

    });


    socket.on('player joined', function (player) {
        connectCounter++;
        addHistory(player + " joined the game.");
        io.emit('total players', { connectCounter });
    })

    socket.on('send player', function (message) {
        serverPlayers[socket.id] = message;
        io.emit('update players', serverPlayers);

    });
    
    // socket.on('restart', function () {
    //     restart();
    // })
    socket.on('view data', function () {

        console.log('\033[2J'); // lots of line breaks. clears screen
        console.log("\x1b[31m\nSHOWING ALL DATA IN PLAYERS ARRAY: \n", "\x1b[37m", serverPlayers);
        console.log("\n\n\n\x1b[31m\nSHOWING ALL DATA IN HISTORY ARRAY: \n", "\x1b[37m", history);
        console.log("\n\n\n\x1b[31m\nSHOWING ALL APPLES IN APPLES ARRAY: \n", "\x1b[37m", apples);

    });

    socket.on('get apples', function () {
        io.emit('apples', { apples });
    });

    socket.on('move apple', function (numr) {
        if (numr.nr) {
            var nr = numr.nr;

            apples[nr].x = Math.random() * 2000;
            apples[nr].y = Math.random() * 2000;
            var data = apples[nr];
            // console.log("apple moved ", data);
            io.emit('move apple', { data });
        } else {
            console.log("error: ", numr.nr);
        }

    });
});


function addHistory(text) {
    history.unshift(getTime() + ": " + text);
    io.emit('history', { history });
}

function getTime() {
    var d = new Date();
    var n = (d.getHours() < 10 ? '0' : '') + d.getHours() + ":" + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes() + ":" + (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
    return n;

}
function restart(apples) {
    serverPlayers = {};
    history = [getTime() + ": Server restarted"];
    connectCounter = 0;

    apples = [];

    nrApples = apples ? apples : 100;
    console.log("Settings reset");
}