import GameObject from '~/gameObjects/GameObject';
import RenderedObject from '~/gameObjects/RenderedObject';
import ColliderDesc from '~/utils/ColliderDesc';

import constants from '~/utils/constants';

export class SnakeBlock extends RenderedObject {
    texture = 'snakeBlock';

    updateBodyTurn(prevBlock, nextBlock) {
        const det = (prevBlock.x - this.x) * (nextBlock.y - this.y) - (prevBlock.y - this.y) * (nextBlock.x - this.x);
        let texture;
        if (det > 0) {
            texture = 'snakeBodyTurnRight';
        } else if (det < 0) {
            texture = 'snakeBodyTurnLeft';
        } else {
            texture = 'snakeBlock';
        }
        this.texture = texture;
    }

}
export class SnakeHead extends RenderedObject {
    texture = 'snakeHead';
}
export class SnakeTail extends RenderedObject {
    texture = 'snakeTail';
}
class Snake extends GameObject {

    static imagesUsed = {
        snakeBlock: 'img/oldSchool/snake_block.png',
        snakeHead: 'img/oldSchool/snake_head.png',
        snakeTail: 'img/oldSchool/snake_tail.png',
        snakeBodyTurnLeft: 'img/oldSchool/snake_turn_left.png',
        snakeBodyTurnRight: 'img/oldSchool/snake_turn_right.png'
    };

    title = 'snake';

    constructor({startX : x, startY: y}, skipInit, player) {
        super(...arguments);
        this.player = player;
        if (skipInit) return;
        this.head = new SnakeHead({x, y, rotation: constants.radianForRight});
        this.body = [
            new SnakeBlock({x: x - 1, y: y, rotation: constants.radianForRight})
        ];

        this.tail = new SnakeTail({x: x - 2, y: y, rotation: constants.radianForRight});

        this.state = {
            dir: 'right',
            faceDir: 'right',
            speedDelayBaseValue: 30,
            speedDelayMinValue: 8,
            speedDelay: 0
        };

    }

    _hash(string) {
            let hash = 0, i, chr, len;
            if (string.length === 0) return hash;
            for (i = 0, len = string.length; i < len; i++) {
                chr   = string.charCodeAt(i);
                hash  = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
    }

    getFilter () {
        if (!this.player) return null;

        if (!this.filter) {
            this.filter = {
                hue: this._hash(this.player.name) % 256
            }
        }
        return this.filter;
    }

    getRenderedChildren() {
        let res =  [this.head].concat(this.body).concat([this.tail]);
        res.forEach(ro => ro.filter = this.getFilter());
        return res;
    }

    getColliders() {
        let res = [new ColliderDesc(this, 'head', {x: this.head.x, y: this.head.y, w: 1, h: 1})];

        res = res.concat(this.body.map(segment => {
            return new ColliderDesc(this, 'body', {x: segment.x, y: segment.y, w: 1, h: 1});
        }));

        res.push(new ColliderDesc(this, 'tail', {x: this.tail.x, y: this.tail.y, w: 1, h: 1}));
        return res;
    }

    update(cfg) {
        if (!this.isDying) {
            this.updateStrategyDefault(cfg);
        } else {
            this.updateStrategyDie(cfg);
        }
    }

    updateStrategyDefault({userInput, remoteData}) {
        let dir;
        if (userInput.find(a => a === 'up arrow')) {
            if (this.state.faceDir != 'down') dir = 'up';
        }
        if (userInput.find(a => a === 'left arrow')) {
            if (this.state.faceDir != 'right') dir = 'left';
        }
        if (userInput.find(a => a === 'right arrow')) {
            if (this.state.faceDir != 'left') dir = 'right';
        }
        if (userInput.find(a => a === 'down arrow')) {
            if (this.state.faceDir != 'up') dir = 'down';
        }
        if (dir === this.state.faceDir) {
            this.state.speedDelay -= 1;
        }

        this.state.dir = dir || this.state.dir;

        if (this.state.speedDelay > 0) {
            this.state.speedDelay -= 1;
        } else {
            const collisions = this.parent.pointCollides(this.moveBlock({
                x: this.head.x,
                y: this.head.y
            }, this.state.dir));
            if (!this.checkAlive(collisions)) {
                this.die();
            } else {
                this.tryEat(collisions);
                this.move(this.state.dir);
            }

            this.state.speedDelay = this.state.speedDelayBaseValue;
        }
    }

    updateStrategyDie() {
        if (this.dyingCount > 0) {
            this.getRenderedChildren().forEach((child) => {
                child.scaleX -= 0.05;
                child.scaleY -= 0.05;
            });
            this.dyingCount--;
        } else {
            this.produceEvent('death');
        }
    }

    moveBlock(block, dir) {
        let res = Object.assign({}, block);
        switch (dir) {
            case 'left' :
                res.x -= 1;
                res.rotation = constants.radianForLeft;
                break;
            case 'right' :
                res.x += 1;
                res.rotation = constants.radianForRight;
                break;
            case 'up' :
                res.y -= 1;
                res.rotation = constants.radianForUp;
                break;
            case 'down' :
                res.y += 1;
                res.rotation = constants.radianForDown;
                break;
        }
        return res;
    }

    tailRotation(from, to) {
        if (from.x > to.x) return constants.radianForLeft;
        if (from.x < to.x) return constants.radianForRight;
        if (from.y > to.y) return constants.radianForUp;
        if (from.y < to.y) return constants.radianForDown;
    }

    insertBends() {
        for (let i = 0; i < this.body.length; i++) {
            let prevBlock = this.body[i - 1] || this.head;
            let nextBlock = this.body[i + 1] || this.tail;
            this.body[i].updateBodyTurn(prevBlock, nextBlock);
        }
        this.tail.rotation = this.tailRotation(this.tail, this.body[this.body.length - 1]);//rotate to always face the last body block
    }

    move(direction) {
        const lastBody = this.body[this.body.length - 1];
        this.tail.x = lastBody.x;
        this.tail.y = lastBody.y;

        for (let i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
            this.body[i].rotation = this.body[i - 1].rotation;
        }
        this.body[0].x = this.head.x;
        this.body[0].y = this.head.y;
        this.body[0].rotation = this.head.rotation;
        this.head = Object.assign(this.head, this.moveBlock(this.head, direction));

        //insert bends
        this.insertBends();
        this.state.faceDir = direction;

        this.produceEvent('move', direction);
    }

    checkAlive(collisions) {
        return !collisions.some(col => col.tag === 'wall' || col.tag === 'tail' || col.tag === 'body');
    }

    tryEat(collisions) {
        let col = collisions.find(col => col.tag === 'food');
        if (col) {
            this.grow();
            this.produceEvent('ate food');
        }
    }

    grow() {
        let newBlock = new SnakeBlock({
            x: this.tail.x,
            y: this.tail.y,
            rotation: this.tail.rotation
        });
        this.body.push(newBlock);
        this.parent.addRenderedChild(newBlock);
        if (this.state.speedDelayBaseValue > this.state.speedDelayMinValue) {
            this.state.speedDelayBaseValue = this.state.speedDelayBaseValue - 2;
        }
        this.produceEvent('grow');
    }

    die() {
        this.dyingCount = 20;
        this.isDying = true;
        this.produceEvent('pre death');
    }

    serialize() {
        return {
            className: 'Snake',
            state: this.state,
            head: this.head.serialize(),
            body: this.body.map(s => s.serialize()),
            tail: this.tail.serialize(),
            player: this.player
        };
    }

    static deserialize(hash) {
        let res = new Snake({}, true, hash.player);
        res.state = hash.state;
        res.head = new SnakeHead(hash.head);
        res.body = hash.body.map(s => SnakeBlock.deserialize(s));
        res.tail = new SnakeTail(hash.tail);
        res.insertBends();
        return res;
    }


}

export default Snake;