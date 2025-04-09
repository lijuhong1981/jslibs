import Check from '@lijuhong1981/jscheck/src/Check.js';
import definedValue from '@lijuhong1981/jscheck/src/getDefinedValue.js';
import isFunction from '@lijuhong1981/jscheck/src/isFunction.js';
import Destroyable from '@lijuhong1981/jsdestroy/src/Destroyable.js';
import AnimationFrameUpdater from './AnimationFrameUpdater.js';

let TaskId = 0;

function getNextTaskId() {
    return TaskId++;
}

/**
 * 任务状态
 * @typedef {Object} TaskState
 * @property {number} None 任务未开始
 * @property {number} Executing 任务执行中
 * @property {number} Finished 任务已结束
 * @property {number} Canceled 任务已取消
 * @property {number} Failed 任务失败
*/
const TaskState = Object.freeze({
    None: 0,
    Executing: 1,
    Finished: 2,
    Canceled: 3,
    Failed: 4,
});

/**
 * 任务对象
*/
class Task extends Destroyable {
    /**
     * @constructor
     * @param {object|undefined} options 配置项
     * @param {boolean|undefined} options.autoDestroy 是否自动销毁任务，当值为true时会自动销毁已完成、取消、失败的任务，默认true
     * @param {Function|undefined} options.onExecute 任务执行函数
     * @param {Function|undefined} options.onFinish 任务完成函数
     * @param {Function|undefined} options.onCancel 任务取消函数
     * @param {Function|undefined} options.onFail 任务失败函数
     */
    constructor(options = {}) {
        super();
        /**
         * 任务id，自动生成
        */
        this.id = getNextTaskId();
        /**
         * 任务状态
         * @type {TaskState}
        */
        this.state = TaskState.None;
        // this.priority = 0;
        /**
         * 是否自动销毁任务，当值为true时会自动销毁已完成、取消、失败的任务
         * @type {boolean}
        */
        this.autoDestroy = definedValue(options.autoDestroy, true);
        if (isFunction(options.onExecute))
            this.onExecute = options.onExecute.bind(this);
        if (isFunction(options.onFinish))
            this.onFinish = options.onFinish.bind(this);
        if (isFunction(options.onCancel))
            this.onCancel = options.onCancel.bind(this);
        if (isFunction(options.onFail))
            this.onCancel = options.onCancel.bind(this);
    }

    /**
     * 开始执行任务，由TaskPool自动调用执行
     * @returns {boolean} 执行结果
     */
    execute() {
        if (this.isDestroyed() || this.state !== TaskState.None) {
            console.warn('The id ' + this.id + ' task state is ' + this.state + ', unable to execute.');
            return false;
        }
        this.state = TaskState.Executing;
        this.onExecute();
        return true;
    }

    /**
     * 任务执行函数，可由任务初始化时传入或子类实现
     */
    onExecute() { }

    /**
     * 任务是否正在执行中
     * @returns {boolean}
    */
    get isExecuting() {
        return this.state === TaskState.Executing;
    }

    /**
     * 取消任务，由外部调用，调用后可取消未执行或执行中的任务
     * @returns {boolean} 取消结果
     */
    cancel() {
        if (this.isDestroyed() || (this.state !== TaskState.None && this.state !== TaskState.Executing)) {
            console.warn('The id ' + this.id + ' task state is ' + this.state + ', unable to cancel.');
            return false;
        }
        this.state = TaskState.Canceled;
        this.onCancel();
        return true;
    }

    /**
     * 任务取消函数，可由任务初始化时传入或子类实现
     */
    onCancel() { }

    /**
     * 任务是否已取消
     * @returns {boolean}
    */
    get isCanceled() {
        return this.state === TaskState.Canceled;
    }

    /**
     * 完成任务，当任务执行完成时调用
     * @returns {boolean} 执行结果
     */
    finish() {
        if (this.isDestroyed() || this.state !== TaskState.Executing) {
            console.warn('The id ' + this.id + ' task state is ' + this.state + ', unable to finish.');
            return false;
        }
        this.state = TaskState.Finished;
        this.onFinish();
        return true;
    }

    /**
     * 任务结束函数，可由任务初始化时传入或子类实现
     */
    onFinish() { }

    /**
     * 任务是否已结束
     * @returns {boolean}
    */
    get isFinished() {
        return this.state === TaskState.Finished;
    }

    /**
     * 任务失败，当任务执行失败时调用
     * @param {*} error 
     * @returns {boolean} 执行结果
     */
    fail(error) {
        if (this.isDestroyed() || this.state !== TaskState.Executing) {
            console.warn('The id ' + this.id + ' task state is ' + this.state + ', unable to fail.');
            return false;
        }
        this.state = TaskState.Failed;
        this.error = error;
        this.onFail(error);
        return true;
    }

    /**
     * 任务失败函数，可由任务初始化时传入或子类实现
     * @param {*} error 
     */
    onFail(error) { }

    /**
     * 任务是否失败
     * @returns {boolean}
    */
    get isFailed() {
        return this.state === TaskState.Failed;
    }
};

/**
 * 任务池，用于管理任务的执行与销毁。
 * 
 * 与线程池类似，可根据设置的可执行任务数自动执行放入任务池中的任务。
 */
class TaskPool extends Destroyable {
    constructor(maximumNumber = 5) {
        super();
        /**
         * 任务同时执行的最大数量
         * @type {number}
        */
        this.maximumNumber = maximumNumber;
        /**
         * 任务队列
         * @type {Array<Task>}
        */
        this.taskQueue = [];

        this.update = this.update.bind(this);
        AnimationFrameUpdater.default.add(this.update);
    }

    /**
     * 添加任务
     * @param {Array<Task>} tasks
     * @returns {this}
     */
    push(...tasks) {
        tasks.forEach(task => {
            Check.instanceOf('task', task, Task);
            this.taskQueue.push(task);
        });
        return this;
    }

    /**
     * @private
    */
    update() {
        if (this.isDestroyed())
            return;

        let executingCount = 0;
        const unexecuteTasks = [];
        const tasks = this.taskQueue.slice();
        tasks.forEach(task => {
            if (task.isDestroyed() || task.isFinished || task.isCanceled || task.isFailed) { //移除掉已销毁、完成、取消、失败的任务
                const index = this.taskQueue.indexOf(task);
                if (index !== -1)
                    this.taskQueue.splice(index, 1);
                if (task.autoDestroy && !task.isDestroyed())
                    task.destroy();
            } else if (task.isExecuting) { //统计执行中的任务
                executingCount++;
            } else { //未执行的任务
                unexecuteTasks.push(task);
            }
        });

        let i = 0;
        while (executingCount < this.maximumNumber && i < unexecuteTasks.length) {
            const task = unexecuteTasks[i];
            if (task.execute())
                executingCount++;
            i++;
        }
    }

    /**
     * 执行销毁
     * @private
     */
    onDestroy() {
        AnimationFrameUpdater.default.remove(this.update);
        this.taskQueue.length = 0;
    }
};

let _default;

Object.defineProperties(TaskPool, {
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

export {
    TaskPool,
    Task,
    TaskState,
};