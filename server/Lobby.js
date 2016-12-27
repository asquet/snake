import Deathmatch from "./Deathmatch";

let counter = 0;
export default class Lobby {
    players = new Map();

    games = new Map();

    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            this.newConnect(socket);
        });
    }

    newConnect(socket) {
        let id = counter++;
        this.players.set(id, {socket});

        socket.emit('setPlayerData', {id});
        this.updateGameList();

        socket.on('disconnect', () => {
            this.players.delete(id);
            this.updatePlayerList();
        });

        socket.on('setName', (name) => {
            this.setName(id, name);
        });

        socket.on('createDeathmatch', (name) => {
            let room = '/dm-' + counter;
            let deathmatch = new Deathmatch(this.io.of(room),  () => {
                this.disposeDeathmatch(socket);
            });

            this.games.set(socket, {name: name, game: deathmatch, namespace: room, owner: id});

            socket.emit('dmStarting', {namespace: room, name: name});
            this.updateGameList();
        });
    }

    updateGameList() {
        this.io.emit('updateGameList', Array.from(this.games.entries()).map(e => ({
            name: e[1].name,
            namespace: e[1].namespace
        })));
    }

    setName(id, name) {
        this.players.get(id).name = name;
        this.updatePlayerList();
    }

    updatePlayerList() {
        this.io.emit('updatePlayerList', Array.from(this.players.entries()).map(e => ({name: e[1].name, id: e[0]})));
    }

    disposeDeathmatch(socket) {
        let dmCfg = this.games.get(socket);
        if (dmCfg) {
            this.io.removeAllListeners(dmCfg.namespace);
            this.games.delete(socket);

            this.updateGameList();
        }
    }
}