import GameObject from '~/gameObjects/GameObject';

export default class Container extends GameObject {
    gameObjects = [];

    addGameObject(obj) {
        this.gameObjects.push(obj);
        obj.getRenderedChildren().forEach(kid => this.addRenderedChild(kid));
        obj.parent = this;
    }

    removeGameObject(obj) {
        this.gameObjects = this.gameObjects.filter(o => o !== obj);
        obj.getRenderedChildren().forEach(kid => this.removeRenderedChild(kid));
        obj.parent = null;
    }

    addRenderedChild(o) {
        this.parent.addRenderedChild(o);
    }

    removeRenderedChild(o) {
        this.parent.removeRenderedChild(o);
    }

    update() {
        this.gameObjects.forEach(go => {
            go.update(...arguments);
        });
    }

    pointCollides({x, y}) {
        return this.parent.pointCollides({x, y});
    }

    _updateSpriteProps(sprite, obj, {positionCfg/*{scaleX, scaleY, offsetX, offsetY}*/}) {
        this.parent._updateSpriteProps(sprite, obj, {positionCfg/*{scaleX, scaleY, offsetX, offsetY}*/});
    }

    redraw(drawCfg) {
        this.gameObjects.forEach(go => {
            if (go.redraw) {
                go.redraw(...arguments);
            } else {
                go.getRenderedChildren().forEach(kid => {
                    this._updateSpriteProps(kid._ui_meta.sprite, kid, drawCfg);
                });
            }
        });
    }

    getColliders() {
        return this.gameObjects.reduce((colliders, go) => {
            return colliders.concat(go.getColliders());
        }, []);
    }

    event(event) {
        this.parent.event(event);
    }

    ascForGameObjects(query) {
        return this.parent.ascForGameObjects(query);
    }

    _queryGameObjects({byClass}) {
        let result = [];
        this.gameObjects.forEach(go => {
            if (go instanceof Container) {
                result = result.concat(go._queryGameObjects(...arguments));
            } else {
                let fitsFilter = false;
                if (byClass) {
                    fitsFilter = fitsFilter && go;
                }
                if (fitsFilter) {
                    result.push(go);
                }
            }
        });

        return result;
    }

    serialize() {
        return {
            className: this.constructor.name,
            gameObjects: this.gameObjects.map(go => go.serialize())
        }
    }

    classForName(name) {
        return this.parent.classForName(name);
    }

    static deserialize(hash) {
        let res = new Container();
        res.parent = hash.parent;
        this.gameObjects =
            hash.gameObjects.forEach(go => {
                let clazz = res.classForName(go.className);
                res.addGameObject(clazz.deserialize(Object.assign(go, {parent: res})));
            });

        return res;
    }
}
