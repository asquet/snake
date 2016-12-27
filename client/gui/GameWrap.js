import $ from 'jquery';
import gameSetup from '~/engine/gameSetup';
import loadLevel from '~/snake/OldSchool/loadLevel';

export default class GameWrap {

    constructor(owner) {
        this.owner = owner;
    }

    render() {
        let html = $(`
            <div id="gameWrap">
                <canvas id="game-canvas"></canvas>
            </div>`);
        this.canvas = html.find('#game-canvas')[0];
        return html;
    }

    startGame() {
        if (!this.game) {
            this.game = gameSetup(loadLevel(), this, window, this.canvas).then(gameRunner => {
                this.game = gameRunner;
                this.game.startGame();
            });
        } else {
            this.game.startGame();
        }
    }

    event(name) {
        this.owner.event('gameWrap', name);
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
        this.canvas = $(this.canvas).parent().empty().append(' <canvas id="game-canvas"></canvas>').find('#game-canvas')[0];
    }
}