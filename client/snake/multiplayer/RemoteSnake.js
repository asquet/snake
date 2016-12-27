import Snake, {SnakeHead, SnakeBlock, SnakeTail} from '../OldSchool/Snake';

export default class RemoteSnake extends Snake {

    title = 'other snake';

    updateStrategyDefault({remoteData}) {
        let data = remoteData[this.player.id] || [];
        data.forEach(ev => {
                switch (ev.event) {
                    case 'moved':
                        this.tryEat(this.parent.pointCollides(this.moveBlock({
                            x: this.head.x,
                            y: this.head.y
                        }, this.state.dir)));
                        this.move(ev.desc);
                        break;
                    case 'grow':
                        this.grow();
                        break;
                    case 'died':
                        this.die();
                        break;
                }
        });
    }

    updateStrategyDie() {
        if (this.dyingCount > 0) {
            this.getRenderedChildren().forEach((child) => {
                child.scaleX -= 0.05;
                child.scaleY -= 0.05;
            });
            this.dyingCount--;
        } else {
            this.produceEvent( 'death', this);
        }
    }

    serialize() {
        return {
            className: 'RemoteSnake',
            state: this.state,
            head: this.head.serialize(),
            body: this.body.map(s => s.serialize()),
            tail: this.tail.serialize(),
            player: this.player
        };
    }
    static deserialize(hash) {
        let res = new RemoteSnake({}, true, hash.player);
        res.state = hash.state;
        res.head = new SnakeHead(hash.head);
        res.body = hash.body.map(s => SnakeBlock.deserialize(s));
        res.tail = new SnakeTail(hash.tail);
        res.insertBends();
        return res;
    }
}