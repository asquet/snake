import io from 'socket.io-client';

export default class LobbyNetManager {

    players = [];
    games = [];

    player = {};

    constructor(owner) {
        this.owner = owner;
    }

    disconnect() {
        this.socket.disconnect();
    }

    connect() {
        if (!this.socket) {
            this.socket = io();
        } else {
            this.socket.connect({ 'forceNew': true});
        }
        this.socket.on('updatePlayerList', (msg) => {
            this.updatePlayerList(msg);
        });
        this.socket.on('updateGameList', (msg) => {
            this.updateGameList(msg);
        });
        this.socket.on('setPlayerData', (data) => {
            this.player = Object.assign(this.player, data);
        });

        this.socket.on('dmStarting', (cfg) => {
            this.owner.event('dmStarting', {dmCfg: cfg, player: this.player});
        });

        this.setName(this.player.name);
    }

    updatePlayerList(list) {
        this.players = list;
        this.owner.event('updatePlayerList', list);
    }
    updateGameList(list) {
        this.games = list;
        this.owner.event('updateGameList', list);
    }

    setName(name) {
        this.player.name = name;
        this.socket.emit('setName', name);
    }

    createGame(gameName) {
        this.socket.emit('createDeathmatch', gameName);
    }
}

