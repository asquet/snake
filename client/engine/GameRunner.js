import PIXI, {requestAnimationFrame} from '~/pixi';
import SnakeFood from "../snake/OldSchool/SnakeFood";

class GameRunner {

    constructor({renderer, rootContainer, userInput, globalState, drawCfg}, owner) {
        this.renderer = renderer;
        this.rootContainer = rootContainer;
        this.userInput = userInput;
        this.globalState = globalState;
        this.drawCfg = drawCfg;

        this.owner = owner;

        this.running = false;
        this.onHalt = false;

        this.rootContainer.parent = this;

        this.ownFood = null;
    }

    startGame() {
        this.running = true;
        this.gameLoop();
    }

    stopGame() {
        this.running = false;
        this.userInput.reset();
    }

    gameLoop() {
        if (!this.onHalt) {
            requestAnimationFrame(this.gameLoop.bind(this));
            this.consumeUserInput();
            if (this.running) {
                this.update();
                if (!this.onHalt) { // can be stoped by events in update
                    this.rootContainer.redraw(this.drawCfg);
                    this.renderer.render(this.rootContainer.stage);
                }
            }
        }
    }

    update() {
        this.rootContainer.update({
            userInput: this.userInput.getActiveState(),
            globalState: this.globalState
        });

        this.respawnObjects();
    }

    respawnObjects() {
        if (this.ownFood === null) {
            this.ownFood = this.respawnFood();
            if (this.ownFood) {
                this.rootContainer.addGameObject(this.ownFood);
            }
        }
    }

    consumeUserInput() {
        let input = this.userInput.getActiveState();
        if (input.some(k => k === 'escape')) {
            this.running = false;
            this.owner.event('menu');
        }
        if (input.some(k => k === 'space')) {
            this.running = !this.running;
        }
    }

    event(event) {
        if (event.from === 'snake' && event.type === 'death') {
            this.onHalt = true;
            this.running = false;
            this.owner.event('game over');
        }
        if (event.type === 'ate food') {
            this.rootContainer.removeGameObject(this.ownFood);
            this.ownFood = null;
        }
        if (event.type === 'error') {
            this.onHalt = true;
            this.running = false;
            this.owner.event('error');
        }
    }

    destroy() {
        this.onHalt = true;
        this.renderer.plugins.interaction.destroy();
        this.renderer = null;
        this.rootContainer.stage.destroy(true);
        this.userInput.detachListeners();
        this.rootContainer = null;

        PIXI.loader.reset();
    }

    /* consider moving spawn methods to separate game objects*/
    respawnFood() {
        let ok = false,
            x, y,
            i = 0;

        while (!ok && i < 1000) {
            x = 1 + Math.floor(Math.random() * (this.globalState.level_size_x - 1));
            y = 1 + Math.floor(Math.random() * (this.globalState.level_size_y - 1));

            ok = this.rootContainer.pointCollides({x, y}).length === 0;

            i++;
        }

        if (i < 1000) {
            return new SnakeFood({x, y});
        }
    }

}


export default GameRunner;