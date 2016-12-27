import GameObject from '~/gameObjects/GameObject';
import ColliderDesc from '~/utils/ColliderDesc';

export default class InvisibleWall extends GameObject {
    constructor({x, y}) {
        super(...arguments);

        this.state = {
            x,
            y
        };
    }

    update() {
        //no need for updates
    }

    getRenderedChildren() {
        return [];//no children
    }

    getColliders() {
        return [new ColliderDesc(this, 'wall', {x: this.state.x, y: this.state.y, w: 1, h: 1})];
    }

    serialize() {
        return {
            className: 'InvisibleWall',
            state: this.state
        };
    }

    static deserialize(hash) {
        return new InvisibleWall(hash.state);
    }
}