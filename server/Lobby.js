import Deathmatch from "./Deathmatch";

let counter = 0;
export default class Lobby {
    playersBySocket = new Map();

    games = new Map();

    constructor(io) {
        this.io = io;

        io.on('connection', (socket) => {
            this.newConnect(socket);
        });
    }

    newConnect(socket) {
        let id = counter++;

        socket.emit('setPlayerData', {id});

        socket.on('disconnect', () => {
            this.playersBySocket.delete(socket);
            this.updatePlayerList();
        });

        socket.on('setName', (name) => {
            this.playersBySocket.set(socket, {id, name});
            this.updatePlayerList();
            this.updateGameList();//update for newly joined players
        });

        socket.on('createDeathmatch', (name) => {
            let room = '/dm-' + counter;
            let deathmatch = new Deathmatch(this.io.of(room), () => {
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

    updatePlayerList() {
        this.io.emit('updatePlayerList', Array.from(this.playersBySocket.values()).map(v => ({
            name: v.name,
            id: v.id
        })));
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