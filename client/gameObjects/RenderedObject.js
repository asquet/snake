export default class RenderedObject {
    constructor({x, y, texture, visible=true, scaleX=1, scaleY=1, rotation=0}) {
        this.x = x;
        this.y = y;
        this.texture = texture || this.texture;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.rotation = rotation;
        this.visible = visible;
    }

    serialize() {
        return {
            x : this.x,
            y : this.y,
            texture : this.texture,
            scaleX : this.scaleX,
            scaleY : this.scaleY,
            rotation : this.rotation,
            visible : this.visible
        };
    }
    static deserialize(hash) {
        return new this(hash);//not sure it is by standard
    }

}