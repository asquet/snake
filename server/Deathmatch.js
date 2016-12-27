export default class Deathmatch {

    playersBySocket = new Map();
    serverSocket = null;

    awaitForInitData = [];

    constructor(io,  notify) {
        this.io = io;
        this.notifyOnServerQuit = notify;

        io.on('connection', (socket) => {
            this.addPlayer(socket);
        });
    }

    addPlayer(socket) {
        if (!this.serverSocket) {
            this.serverSocket = socket;
        }
        socket.on('disconnect', () => {
            this.playersBySocket.delete(socket);
            this.updatePlayerList();
            if (socket === this.serverSocket) {
                this.serverQuit();
            }
        });

        socket.on('hi i am', (player) => {
            this.playersBySocket.set(socket, player);
        });

        socket.on('client wants state', () => {
            this.awaitForInitData.push(socket);
            this.serverSocket.emit('server wants state');
        });
        this.serverSocket.on('client gives state', (data) => {
            this.awaitForInitData.forEach(socket => socket.emit('server gives state', data));
            this.awaitForInitData = [];
        });


        socket.on('snake moved', (t, dir ) => {
            let player = this.playersBySocket.get(socket);
            socket.broadcast.emit('other snake moved', player.id, dir);
        });
        socket.on('snake grow', (player) => {
            socket.broadcast.emit('other snake grow', player.id);
        });
        socket.on('snake died', () => {
            let player = this.playersBySocket.get(socket);
            socket.broadcast.emit('other snake died', player.id);
        });
        socket.on('snake respawned', (t, coords) => {
            let player = this.playersBySocket.get(socket);
            socket.broadcast.emit('other snake respawned', player, coords);
        });
        socket.on('food respawned', (player, coords) => {
            socket.broadcast.emit('other food respawned', player, coords);
        });
    }

    updatePlayerList() {
        this.io.emit('updatePlayerList', Array.from(this.playersBySocket.values()));
    }
    serverQuit() {
        this.io.emit('serverQuit');
        this.notifyOnServerQuit()
    }



}