import Check from '@lijuhong1981/jscheck/src/Check.js';
import Destroyable from '@lijuhong1981/jsdestroy/src/Destroyable.js';
import destroyHTMLElement from '@lijuhong1981/jsdestroy/src/destroyHTMLElement.js';
import destroyObject from '@lijuhong1981/jsdestroy/src/destroyObject.js';

function destroyValue(value) {
    if (value instanceof HTMLElement)
        destroyHTMLElement(value);
    else
        destroyObject(value);
}

class Cache extends Destroyable {
    constructor() {
        super();
        this.map = new Map();
    }

    add(key, value) {
        Check.valid('key', key);
        Check.valid('value', value);

        if (this.map.get(key) === value)
            return;

        this.map.set(key, value);

        return this;
    }

    get(key) {
        return this.map.get(key);
    }

    contains(key) {
        return this.map.has(key);
    }

    remove(key, destroy) {
        if (destroy) {
            const value = this.map.get(key);
            if (value) {
                destroyValue(value);
            }
        }
        this.map.delete(key);
        return this;
    }

    clear(destroy) {
        if (destroy) {
            const values = this.map.values();
            for (const value of values) {
                destroyValue(value);
            }
        }
        this.map.clear();
        return this;
    }

    destroy() {
        this.clear(true);
        return super.destroy();
    }
};

export default Cache;