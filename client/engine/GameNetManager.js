import io from 'socket.io-client';

export default class GameNetManager {

    constructor(owner) {
        this.owner = owner;
    }

    disconnect() {
        this.socket.disconnect();
    }

    connect(namespace, player) {
        this.player = player;
        if (!this.socket) {
            this.socket = io(namespace);
        } else {
            this.socket.connect(namespace, {'forceNew': true});
        }

        this.socket.emit('hi i am', player);


        this.socket.on('updatePlayerList', (msg) => {
            this.updatePlayerList(msg);
        });
        this.socket.on('server gives state', (data) => {
            this.serverGaveState(data);
        });
        this.socket.on('server wants state', () => {
            this.serverWantsState();
        });

        this.socket.on('other snake moved', (player, dir) => {
            this.updateCallback && this.updateCallback(player, 'moved', dir);
        });
        this.socket.on('other snake grow', (player) => {
            this.updateCallback && this.updateCallback(player, 'grow');
        });
        this.socket.on('other snake died', (player) => {
            this.updateCallback && this.updateCallback(player, 'died');
        });
        this.socket.on('other snake respawned', (player, coords) => {
            this.updateCallback && this.updateCallback(player, 'snake respawned', coords);
        });
        this.socket.on('other food respawned', (id, coords) => {
            this.updateCallback && this.updateCallback(id, 'food respawned', coords);
        });
    }

    updatePlayerList(list) {
        this.players = list;
        this.owner.event('updatePlayerList', list);
    }

    requestCurrentState() {
        this.socket.emit('client wants state');
    }
    serverWantsState() {
        this.owner.event('serverWantsState');
    }
    sendStateToServer(data) {
        this.socket.emit('client gives state', data);
    }

    serverGaveState(data) {
        this.owner.event('loadInitData', data);
    }
    snakeMoved(dir) {
        this.socket.emit('snake moved', this.player, dir);
    }
    snakeDied() {
        this.socket.emit('snake died', this.player);
    }
    snakeGrow(player) {
        this.socket.emit('snake grow', player);
    }
    respawnSnake(coords) {
        this.socket.emit('snake respawned', this.player, coords);
    }
    respawnFood(coords) {
        this.socket.emit('food respawned', this.player, coords);
    }


}