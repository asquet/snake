import GameRunner from './GameRunner';
import Snake from '~/snake/OldSchool/Snake';
import RemoteSnake from '~/snake/multiplayer/RemoteSnake';


export default class RemoteGameRunner extends GameRunner {
    constructor(cfg, owner, remote) {
        super(cfg, owner);
        this.remote = remote;
        this.remote.updateCallback = this.onRemoteUpdate.bind(this);
        this.personalGlobalState = cfg.personalGlobalState;
        this.remoteData = {};

        this.ownSnake = null;
    }

    update() {
        this.rootContainer.update({
            userInput: this.userInput.getActiveState(),
            globalState: this.globalState,
            remoteData: this.remoteData
        });

        this.remoteData = {};//clear after data is consumed
        this.respawnObjects();

    }

    respawnObjects() {
        if (this.ownSnake === null) {
            this.ownSnake = this.respawnSnake();
            if (this.ownSnake) {
                this.rootContainer.addGameObject(this.ownSnake);
                this.remote.respawnSnake({
                    x: this.ownSnake.head.x,
                    y: this.ownSnake.head.y
                });
            }
        }

        if (this.personalGlobalState.isServer) {
            if (this.ownFood === null) {
                this.ownFood = this.respawnFood();
                if (this.ownFood) {
                    this.rootContainer.addGameObject(this.ownFood);
                    this.remote.respawnFood({
                        x: this.ownFood.state.x,
                        y: this.ownFood.state.y
                    });
                }
            }
        }
    }

    event(event) {
        if (event.from === 'snake' && event.type === 'pre death') {
            this.owner.event('my snake died');
            this.remote.snakeDied();
        } else if (event.from === 'snake' && event.type === 'death') {
            this.rootContainer.removeGameObject(this.ownSnake);
            this.ownSnake = null;
        } else if (event.from === 'snake' && event.type === 'move') {
            this.remote.snakeMoved(event.desc);
        } else if (event.from === 'snake' && event.type === 'grow') {
            if (this.personalGlobalState.isServer) this.remote.snakeGrow();
        } else if (event.from === 'other snake' && event.type === 'death') {
            this.rootContainer.removeGameObject(event.desc);
        } else if (event.type === 'ate food') {
            if (this.personalGlobalState.isServer) {
                super.event(event);
            }
        } else {
            super.event(event);
        }
    }

    onRemoteUpdate(player, event, desc) {
        if (event === 'snake respawned') {
            this.rootContainer.addGameObject(new RemoteSnake({startX: desc.x, startY: desc.y}, false, player));
        } else if (event === 'food respawned') {
            this.remoteData["snake_food"] = desc;
        } else {
            let data = this.remoteData[player] || [];
            this.remoteData[player] = data.concat([{event, desc}]);
        }
    }

    respawnSnake() {
        let x, y, ok = false, i = 0;
        while (!ok && i < 1000) {
            x = 1 + Math.floor(Math.random() * (this.globalState.level_size_x - 1));
            y = 1 + Math.floor(Math.random() * (this.globalState.level_size_y - 1));

            ok = true;
            for (let i = -4; i <= 3; i++) {
                for (let j = -1; j <= 1; j++) {
                    ok = ok && this.rootContainer.pointCollides({x: x + i, y: y + j}).length === 0;
                }
            }

            i++;
        }
        if (i < 1000) {
            return new Snake({startX: x, startY: y}, false, this.personalGlobalState.player);
        } else {
            return null;
        }
    }

}