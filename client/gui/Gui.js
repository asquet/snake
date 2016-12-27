import $ from 'jquery';
import Menu from './Menu';
import GameWrap from './GameWrap';
import Multiplayer from './Multiplayer';
import Deathmatch from './Deathmatch';

export default class Gui {
    constructor(div) {
        this.$div = $(div);

        this.currentDisplay = null;
        this.menu = new Menu(this);
        this.gameWrap = new GameWrap(this);
        this.multiplayer = new Multiplayer(this);
        this.deathmatch = new Deathmatch();

        this.append('menu', this.menu.render());
        this.append('gameWrap', this.gameWrap.render());
        this.append('multiplayer', this.multiplayer.render());
        this.append('deathmatch', this.deathmatch.render());

        this.onMenu();
    }

    event(from, event, desc) {
        switch (from) {
            case 'menu' :
                this.menuEvent(event, desc);
                break;
            case 'gameWrap':
                this.gameWrapEvent(event, desc);
                break;
            case 'multiplayer':
                this.multiplayerEvent(event, desc);
                break;
            case 'deathmatch':
                this.deathmatchEvent(event, desc);
                break;
        }
    }

    menuEvent(event) {
        switch (event) {
            case 'startSolo':
                this.onGameWrap();
                this.gameWrap.startGame();
                break;
            case 'multiplayer':
                this.onMultiplayer();
                break;
        }
    }

    gameWrapEvent(event) {
        switch (event) {
            case 'menu' :
                if (confirm('Abandon current game and return to menu?')) {
                    this.gameWrap.pauseGame();
                    this.onMenu();
                }
                break;
            case 'game over':
                alert('Game over');
                this.onMenu();
        }
    }

    multiplayerEvent(event, desc) {
        switch (event) {
            case 'menu' :
                this.onMenu();
                break;
            case 'dmStarting':
                this.onDeathmatch('create', desc);
                break;
            case 'joinGame':
                this.onDeathmatch('join', desc);
                break;
        }
    }

    deathmatchEvent(event, desc) {
    }

    append(name, dom) {
        this.$div.append(`<div class="topLevel ${name}"></div>`);
        this.$div.find(`.topLevel.${name}`).append(dom);
    }


    changeRoute(name) {
        this.currentDisplay && this.currentDisplay.onLeave && this.currentDisplay.onLeave();

        this.currentDisplay = this[name];
        this.$div.find('.topLevel').hide();
        this.$div.find('.topLevel.' + name).show();
    }

    onMenu() {
        this.changeRoute('menu');
    }

    onGameWrap() {
        this.changeRoute('gameWrap');
    }

    onMultiplayer() {
        this.changeRoute('multiplayer');
        this.multiplayer.connect();
    }

    onDeathmatch(action, cfg) {
        this.changeRoute('deathmatch');
        if (action === 'create') {
            this.deathmatch.createGame(cfg);
        }
        if (action === 'join') {
            this.deathmatch.joinGame(cfg);
        }

    }
}