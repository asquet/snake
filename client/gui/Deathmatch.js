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
                <h1>Deathmatch</h1>
                <div>
                    <canvas id="game-duel-canvas"></canvas>
                </div>
                <button class="back">back</button>
            </div>`);
        this.canvas = html.find('#game-duel-canvas')[0];
        html.find('button.back').on('click',()=>this.owner.event('deathmatch', 'menu'));
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
            gameSetup(loadLevel(null, true, this.player), this, window, this.canvas, this.remote).then(gameRunner => {
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
                gameSetup(loadLevel(desc, false, this.player), this, window, this.canvas, this.remote).then(gameRunner => {
                    this.game = gameRunner;
                    this.game.startGame();
                });
                break;
            case "serverWantsState":
                this.remote.sendStateToServer(this.game.rootContainer.serialize());
                break;
            case "server quit": {
                alert('Server diconnected. Quiting');
                this.owner.event('deathmatch', 'menu');
            }
        }
    }

    pauseGame() {
        this.game.stopGame();
    }

    onLeave() {
        this.disposeGame();
    }

    disposeGame() {
        this.remote.disconnect();
        if (this.game) {
            this.game.destroy();
            this.game = null;
            this.canvas = $(this.canvas).parent().empty().append(' <canvas id="game-duel-canvas"></canvas>').find('#game-duel-canvas')[0];
        }
    }
}