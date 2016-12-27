import $ from 'jquery';
import gameSetup from '~/engine/gameSetup';
import loadLevel from '~/snake/multiplayer/loadLevel';
import GameNetManager from '~/engine/GameNetManager';

export default class Deathmatch {
    constructor(owner) {
        this.owner = owner;
        this.remote = new GameNetManager(this);
    }

    render() {
        let html = $(`
            <div id="gameWrap">
                <canvas id="game-duel-canvas"></canvas>
            </div>`);
        this.canvas = html.find('#game-duel-canvas')[0];
        return html;
    }

    createGame({dmCfg, player}) {
        this.startGame({dmCfg, player}, true);
    }

    joinGame({dmCfg, player}) {
        this.startGame({dmCfg, player}, false);
    }

    startGame({dmCfg, player}, isServer) {
        this.player = player;
        this.namespace = dmCfg.namespace;
        this.name = dmCfg.name;
        this.remote.connect(dmCfg.namespace, player);

        if (isServer) {
            this.game = gameSetup(loadLevel(null, true, this.player), this, window, this.canvas, this.remote).then(gameRunner => {
                this.game = gameRunner;
                this.game.startGame();
            });
        } else {
            this.remote.requestCurrentState();
            //see event @loadInitData
        }
    }


    event(name, desc) {
        switch (name) {
            case "loadInitData":
                this.game = gameSetup(loadLevel(desc, false, this.player), this, window, this.canvas, this.remote).then(gameRunner => {
                    this.game = gameRunner;
                    this.game.startGame();
                });
                break;
            case "serverWantsState":
                this.remote.sendStateToServer(this.game.rootContainer.serialize());
                break;
        }
    }

    pauseGame() {
        this.game.stopGame();
    }

    onLeave() {
        this.disposeGame();
    }

    disposeGame() {
        this.game.destroy();
        this.game = null;
        this.canvas = $(this.canvas).parent().empty().append(' <canvas id="game-duel-canvas"></canvas>').find('#game-duel-canvas')[0];

        this.remote.disconnect();
    }
}