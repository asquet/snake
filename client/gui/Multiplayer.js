import $ from 'jquery';
import RemoteLobby from '~/engine/LobbyNetManager';
import Cookies from 'js-cookie';

export default class Multiplayer {
    constructor(owner) {
        this.owner = owner;
        this.remote = new RemoteLobby(this);
        this.remote.player.name = Cookies.get('name') || ('anon-' + new Date().getTime()).substring(0, 10);
    }

    render() {
        if (this.html) {
            $(this.html).find('*').off();
        }

        this.html = $(`
        <div id='multiplayer'>
            <h1>Multiplayer</h1>
            <div>
                <label for='name'>Your Name:</label>
                <input name='name' value='${this.remote.player.name}'/>
                <button id='setName'>Ok</button>
            </div>
            <div class="mutiplayer-list">
                <h2>Currently online:</h2>
                <ul>
                    ${this.remote.players.map(player => {
                        return `<li>${player.name}</li>`;
                    }).join('')}
                </ul>
            </div>
            <div class="mutiplayer-list">
                <h2>Ongoing games:</h2>
                <ul>
                    ${this.remote.games.map(game => {
                        return `<li>${game.name}<button class='joinGame' data-namespace='${game.namespace}'>Join</button></li>`;
                    }).join('')}
                </ul>
                <button class='createGame'>Create new</button>
                <button class='back'>Back</button>
            </div>
        </div>
        `);


        this.html.find('button.joinGame').on('click', (ev) => {
            let namespace = $(ev.target).attr('data-namespace');
            let name = $(ev.target).text();
            this.owner.event('multiplayer', 'joinGame', {dmCfg: {namespace, name}, player : this.remote.player});
        });
        this.html.find('#setName').on('click', () => {
            this.setName(this.html.find('input[name=name]').val());
        });

        this.html.find('button.createGame').on('click', () => {
            let name = prompt('Enter game name') || ('dm-' + new Date().getTime()).substring(7);
            this.remote.createGame(name);
        });

        this.html.find('button.back').on('click', () => {
            this.owner.event('multiplayer', 'menu');
        });

        return this.html;
    }

    reRender() {
        this.html.parent().empty().append(this.render());
    }

    connect() {
        this.remote.connect();
    }

    disconnect() {
        this.remote.disconnect();
    }

    onLeave() {
        this.disconnect();
    }

    setName(name) {
        Cookies.set('name', name);
        this.remote.setName(name);
    }

    event(type, desc) {
        switch (type) {
            case 'updatePlayerList' :
            case 'updateGameList' :
                this.reRender();
                break;
            case 'dmStarting':
                this.owner.event('multiplayer', 'startGame', desc);
                break;
        }
    }

}