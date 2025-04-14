import Check from "@lijuhong1981/jscheck/src/Check.js";
import isDefined from "@lijuhong1981/jscheck/src/isDefined.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import now from "@lijuhong1981/jstime/src/now.js";

/**
 * 动画帧执行器，根据设置的帧率执行动画帧
 * @see {requestAnimationFrame}
*/
class AnimationFrameUpdater extends Destroyable {
    /**
     * @constructor
     * @param {boolean} autoStart 自动开始，默认true
     * @param {number} framesPerSecond 帧率，默认60
     */
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

    /**
     * 设置帧率
     * @param {number} value
     */
    set framesPerSecond(value) {
        Check.typeOf.number.greaterThan('framesPerSecond', value, 0);
        if (this._framesPerSecond !== value) {
            this._framesPerSecond = value;
            this._intervalTime = 1000 / value;
        }
    }

    /**
     * 获取帧率
     * @returns {number}
     */
    get framesPerSecond() {
        return this._framesPerSecond;
    }

    /**
     * @private
    */
    update() {
        if (this.isStoped)
            return this;
        this.animationFrameHandler = window.requestAnimationFrame(this.update);
        const newTime = now();
        const deltaTime = newTime - this._oldTime;
        if (deltaTime >= this._intervalTime) {
            this._oldTime = newTime;
            const updateFuncs = this.updateFuncs.slice();
            updateFuncs.forEach(updateFunc => {
                updateFunc(deltaTime);
            });
        }
        return this;
    }

    /**
     * 启动
     * @returns {this}
    */
    start() {
        if (this.isStarted)
            return;
        this.isStarted = true;
        this.isStoped = false;
        this.update();
        return this;
    }

    /**
     * 停止
     * @returns {this}
    */
    stop() {
        this.isStoped = true;
        this.isStarted = false;
        if (isDefined(this.animationFrameHandler)) {
            window.cancelAnimationFrame(this.animationFrameHandler);
            delete this.animationFrameHandler;
        }
        return this;
    }

    /**
     * 更新函数数量
     * @returns {number}
    */
    get numberOfUpdateFuncs() {
        return this.updateFuncs.length;
    }

    /**
     * 获取一个更新函数索引
     * @param {Function} updateFunc
     * @returns {number}
     */
    indexOf(updateFunc) {
        return this.updateFuncs.indexOf(updateFunc);
    }

    /**
     * 是否包含一个更新函数
     * @param {Function} updateFunc
     * @returns {boolean}
     */
    contains(updateFunc) {
        return this.indexOf(updateFunc) !== -1;
    }

    /**
     * 添加一个更新函数
     * @param {Function} updateFunc
     * @returns {this}
     */
    add(updateFunc) {
        Check.typeOf.func('updateFunc', updateFunc);
        if (!this.contains(updateFunc))
            this.updateFuncs.push(updateFunc);
        return this;
    }

    /**
     * 移除一个更新函数
     * @param {Function} updateFunc
     * @returns {this}
     */
    remove(updateFunc) {
        const index = this.indexOf(updateFunc);
        if (index !== -1)
            this.updateFuncs.splice(index, 1);
        return this;
    }

    /**
     * 根据索引移除一个更新函数
     * @param {number} index
     * @returns {this}
     */
    removeAt(index) {
        Check.typeOf.integer('index', index);
        const updateFunc = this.updateFuncs[index];
        if (updateFunc)
            this.updateFuncs.splice(index, 1);
        return this;
    }

    /**
     * 移除所有更新函数
     * @returns {this}
     */
    removeAll() {
        this.updateFuncs.length = 0;
        return this;
    }

    /**
     * 执行销毁
     * @private
     */
    onDestroy() {
        this.stop();
        this.removeAll();
    }
};

let _default;

Object.defineProperties(AnimationFrameUpdater, {
    /**
     * 获取一个默认实例对象
    */
    default: {
        configurable: false,
        get: function () {
            if (!_default)
                _default = new AnimationFrameUpdater();
            return _default;
        }
    },
    /**
     * 获取一个默认实例对象
    */
    getDefault: {
        configurable: false,
        writable: false,
        value: function () {
            return this.default;
        }
    },
    /**
     * 获取一个默认实例对象
     * @deprecated
    */
    instance: {
        configurable: false,
        get: function () {
            console.warn('The instance property has deprecated, use default instead.');
            return this.default;
        }
    },
    /**
     * 获取一个默认实例对象
     * @deprecated
    */
    getInstance: {
        configurable: false,
        writable: false,
        value: function () {
            console.warn('The getInstance function has deprecated, use getDefault instead.');
            return this.default;
        }
    },
});

export default AnimationFrameUpdater;
export { AnimationFrameUpdater };