import SnakeFood from '~/snake/OldSchool/SnakeFood';

export default class RemoteSnakeFood extends SnakeFood {
    title = 'remote food';

    update({remoteData}) {
        let data = remoteData['snake_food'];
        if (data) {
            this.state.x = data.x;
            this.state.y = data.y;
            this.display.x = data.x;
            this.display.y = data.y;
        }
    }

    serialize() {
        return {
            className: 'RemoteSnakeFood',
            state: this.state
        };
    }

    static deserialize(hash) {
        return new RemoteSnakeFood(hash.state);
    }
}