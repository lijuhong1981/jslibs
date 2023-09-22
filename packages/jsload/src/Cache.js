import Check from '@lijuhong1981/jscheck/src/Check.js';
import definedValue from '@lijuhong1981/jscheck/src/getDefinedValue.js';
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
        this.destroyValues = true;
    }

    set(key, value, destroyOldValue) {
        Check.valid('key', key);
        Check.valid('value', value);

        destroyOldValue = definedValue(destroyOldValue, this.destroyValues);
        const oldValue = this.map.get(key);
        if (oldValue === value)
            return;

        if (oldValue && destroyOldValue)
            destroyValue(oldValue);
        this.map.set(key, value);

        return this;
    }

    get(key) {
        return this.map.get(key);
    }

    has(key) {
        return this.map.has(key);
    }

    contains(key) {
        return this.map.has(key);
    }

    delete(key, destroy) {
        destroy = definedValue(destroy, this.destroyValues);
        if (destroy) {
            const value = this.map.get(key);
            if (value) {
                destroyValue(value);
            }
        }
        this.map.delete(key);
        return this;
    }

    add(key, value, destroyOldValue) {
        return this.set(key, value, destroyOldValue);
    }

    remove(key, destroy) {
        return this.delete(key, destroy);
    }

    clear(destroy) {
        destroy = definedValue(destroy, this.destroyValues);
        if (destroy) {
            const values = this.map.values();
            for (const value of values) {
                destroyValue(value);
            }
        }
        this.map.clear();
        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.clear();
    }
};

export default Cache;