import $ from 'jquery';

export default class Menu {

    constructor(owner) {
        this.owner = owner;
    }

    render() {
        let html = $(`
        <div id="mainMenu">
            <h1>menu</h1>
            <ul>
                <li><button id="startSolo">Solo Game</button></li>
                <li><button id="multiplayer">Multiplayer</button></li>
            </ul>
        </div>`);

        html.find('#startSolo').click(() => {
            this.owner.event('menu', 'startSolo');
        });
        html.find('#multiplayer').click(() => {
            this.owner.event('menu', 'multiplayer');
        });
        html.find('#highScores').click(() => {
            this.owner.event('menu', 'highScores');
        });

        return html;
    }

}