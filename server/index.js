import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import connectLr from 'connect-livereload';
import Lobby from "./Lobby";

let app = express(),
    httpServer = http.Server(app),
    io = socketIo(httpServer);

app.use(connectLr({port: 35729}));

app.get('/', function (req, res) {
    res.sendFile('index.html', {'root': './dist/client'});
});
app.use('/', express.static('./dist/client'));

app.use('/img', express.static('./img'));

let lobby = new Lobby(io);

httpServer.listen(process.env.PORT || 3000, function () {
    console.log('listening on *:3000');
});