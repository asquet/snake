import Event from '~/utils/Event';

export default class GameObject {

    parent = null;//should be filled by container

    state = {};

    static imagesUsed = {};

    serialize() {
        throw new Error('Update not implemented');
    }
    static deserialize() {
        throw new Error('Update not implemented');
    }
    update() {
        throw new Error('Update not implemented');
    }

    getRenderedChildren() {
        return [];
    }

    getColliders() {
        return [];
    }

    produceEvent(eventName, descr) {
        this.parent.event(new Event(this.title, eventName, descr, this));
    }

}