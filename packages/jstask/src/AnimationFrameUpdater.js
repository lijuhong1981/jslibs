import Check, { defined } from "@lijuhong1981/jscheck";
import { Destroyable } from "@lijuhong1981/jsdestroy";
import { now } from "@lijuhong1981/jstime";

class AnimationFrameUpdater extends Destroyable {
    constructor(autoStart = true, framesPerSecond = 60) {
        super();
        this.updateFuncs = [];
        this.isStarted = false;
        this.isStoped = false;
        this.update = this.update.bind(this);
        this._oldTime = 0;
        this.framesPerSecond = framesPerSecond;

        if (autoStart)
            this.start();
    }

    set framesPerSecond(value) {
        Check.typeOf.number.greaterThan('framesPerSecond', value, 0);
        if (this._framesPerSecond !== value) {
            this._framesPerSecond = value;
            this._intervalTime = 1000 / value;
        }
    }

    get framesPerSecond() {
        return this._framesPerSecond;
    }

    update() {
        if (this.isStoped)
            return;
        this.animationFrameHandler = window.requestAnimationFrame(this.update);
        const newTime = now();
        const deltaTime = newTime - this._oldTime;
        if (deltaTime >= this._intervalTime) {
            this._oldTime = newTime;
            this.updateFuncs.forEach(updateFunc => {
                updateFunc(deltaTime);
            });
        }
        return this;
    }

    start() {
        if (this.isStarted)
            return;
        this.isStarted = true;
        this.isStoped = false;
        this.update();
        return this;
    }

    stop() {
        this.isStoped = true;
        this.isStarted = false;
        if (defined(this.animationFrameHandler)) {
            window.cancelAnimationFrame(this.animationFrameHandler);
            delete this.animationFrameHandler;
        }
        return this;
    }

    get length() {
        return this.updateFuncs.length;
    }

    indexOf(updateFunc) {
        return this.updateFuncs.indexOf(updateFunc);
    }

    contains(updateFunc) {
        return this.indexOf(updateFunc) !== -1;
    }

    add(updateFunc) {
        Check.typeOf.func('updateFunc', updateFunc);
        if (!this.contains(updateFunc))
            this.updateFuncs.push(updateFunc);
        return this;
    }

    remove(updateFunc) {
        const index = this.indexOf(updateFunc);
        if (index !== -1)
            this.updateFuncs.splice(index, 1);
        return this;
    }

    removeAt(index) {
        Check.typeOf.integer('index', index);
        const updateFunc = this.updateFuncs[index];
        if (updateFunc)
            this.updateFuncs.splice(index, 1);
        return this;
    }

    removeAll() {
        this.updateFuncs.length = 0;
        return this;
    }

    destroy() {
        this.stop();
        this.removeAll();
        super.destroy();
        return this;
    }
};

let _instance;

Object.defineProperties(AnimationFrameUpdater, {
    instance: {
        configurable: false,
        get: function () {
            if (!_instance)
                _instance = new AnimationFrameUpdater();
            return _instance;
        }
    },
    getInstance: {
        configurable: false,
        writable: false,
        value: function () {
            return this.instance;
        }
    },
});

export default AnimationFrameUpdater;