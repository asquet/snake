import Container from './Container';
import PIXI from '~/pixi';

export default class RootContainer extends Container {
    constructor(stage, classesByName) {
        super(...arguments);
        this.stage = stage;
        this.classesByName = classesByName;
    }

    _createSprite(renderedObject) {
        let sprite = new PIXI.Sprite(PIXI.loader.resources[renderedObject.texture].texture);
        sprite.visible = false; //hide initially
        sprite.pivot.set(5, 5); //for rotation around center

        return sprite;
    }

    //TODO move to be together with RootContainer._createSprite ?
    _updateSpriteProps(sprite, obj, {positionCfg/*{scaleX, scaleY, offsetX, offsetY}*/}) {
        if (!sprite) {
            this.addRenderedChild(obj);
            sprite = obj._ui_meta.sprite;
        }
        sprite.x = obj.x * positionCfg.scaleX + positionCfg.offsetX;
        sprite.y = obj.y * positionCfg.scaleY + positionCfg.offsetY;
        sprite.scale.x = obj.scaleX;
        sprite.scale.y = obj.scaleY;
        sprite.rotation = obj.rotation;
        sprite.visible = obj.visible;

        if (obj.filter) {
            //TODO bring some beauty here
            let filter = new PIXI.filters.ColorMatrixFilter();

            if (obj.filter.hue) filter.hue(obj.filter.hue);

            sprite.filters = [filter];
        }

        if (obj.texture !== obj._ui_meta.texture) {
            sprite.texture = PIXI.loader.resources[obj.texture].texture;
            obj._ui_meta.texture = obj.texture;
        }
    }

    addRenderedChild(obj) {
        const sprite = this._createSprite(obj);
        obj._ui_meta = {
            sprite: sprite,
            texture: obj.texture
        };

        this.stage.addChild(sprite);
    }

    removeRenderedChild(obj) {
        this.stage.removeChild(obj._ui_meta.sprite);
        obj._ui_meta.sprite = null;
    }

    ascForGameObjects(query) {
        return this._queryGameObjects(query);
    }

    //TODO consider removing
    collectCollisions() {
        let colliders = this.getColliders();
        let collisions = new Map();

        for (let i = 0; i < colliders.length; i++) {
            for (let j = i + 1; j < colliders.length; j++) {
                if (colliders[i].intersectsWith(colliders[j].rect)) {
                    collisions.set(colliders[i].gameObject, (collisions.get(colliders[i].gameObject) || []).concat({
                        self: colliders[i],
                        other: colliders[j]
                    }));
                    collisions.set(colliders[j].gameObject, (collisions.get(colliders[j].gameObject) || []).concat({
                        self: colliders[j],
                        other: colliders[i]
                    }));
                }
            }
        }
        return collisions;
    }

    pointCollides({x, y}) {
        return this.getColliders().filter(col => {
            return col.rect.contains(x, y);
        });
    }

    classForName(name) {
        return this.classesByName[name];
    }

    static deserialize() {
        throw new Error('should not deserialize');
    }

    loadSerializedLevel(json) {
        json.gameObjects.forEach(go => {
            const clazz = this.classForName(go.className);
            this.addGameObject(clazz.deserialize(Object.assign(go, {parent: this})));
        });
    };

}