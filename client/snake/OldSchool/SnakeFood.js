import GameObject from '~/gameObjects/GameObject';
import RenderedObject from '~/gameObjects/RenderedObject';
import ColliderDesc from '~/utils/ColliderDesc';
import Event from '~/utils/Event';

class FoodBlock extends RenderedObject {
    texture = 'foodBlock';
}

class SnakeFood extends GameObject {

    static imagesUsed = {foodBlock: 'img/oldSchool/food.jpg'};

    constructor({x, y}) {
        super(...arguments);
        this.display = new FoodBlock({x, y});

        this.state = {
            x,
            y
        };
    }

    getRenderedChildren() {
        return [this.display];
    }

    getColliders() {
        return new ColliderDesc(this, 'food', {x: this.display.x, y: this.display.y, w: 1, h: 1});
    }

    update() {

    }

    serialize() {
        return {
            className: 'SnakeFood',
            state: this.state
        };
    }

    static deserialize(hash) {
        return new SnakeFood(hash.state);
    }
}

export default SnakeFood;