import Check from '@lijuhong1981/jscheck';
import { Destroyable } from '@lijuhong1981/jsdestroy';
import AnimationFrameUpdater from './AnimationFrameUpdater.js';

let TaskId = 0;

function getNextTaskId() {
    return TaskId++;
}

const State = Object.freeze({
    None: 0,
    Executing: 1,
    Finished: 2,
    Canceled: 3,
});

class Task extends Destroyable {
    constructor() {
        super();
        this.id = getNextTaskId();
        this.state = State.None;
        this.priority = 0;
    }

    execute() {
        if (this.isDestroyed() || this.isFinished || this.isCanceled || this.isExecuting) {
            console.warn('the id ' + this.id + ' task state is ' + this.state + ', unable do execute.');
            return false;
        }
        this.state = State.Executing;
        this.onExecute();
        return true;
    }

    onExecute() { }

    get isExecuting() {
        return this.state === State.Executing;
    }

    cancel() {
        if (this.isDestroyed() || this.isFinished)
            return false;
        this.state = State.Canceled;
        this.onCancel();
        return true;
    }

    onCancel() { }

    get isCanceled() {
        return this.state === State.Canceled;
    }

    finish() {
        if (this.isDestroyed())
            return false;
        this.state = State.Finished;
        this.onFinish();
        return true;
    }

    onFinish() { }

    get isFinished() {
        return this.state === State.Finished;
    }
};

/**
 * 任务池，用于管理任务的执行与销毁
 */
class TaskPool extends Destroyable {
    constructor(maximumNumber = 5) {
        super();
        //任务同时执行的最大数量
        this.maximumNumber = maximumNumber;
        //任务队列
        this.taskQueue = [];

        this.update = this.update.bind(this);
        // this.update();
        AnimationFrameUpdater.instance.add(this.update);
    }

    push(task) {
        Check.instanceOf('task', task, Task);
        this.taskQueue.push(task);
    }

    update() {
        if (this.isDestroyed())
            return;
        this.onUpdate();
    }

    onUpdate() {
        let executingCount = 0;
        const unexecuteTasks = [];
        const tasks = this.taskQueue.slice();
        tasks.forEach(task => {
            if (task.isFinished || task.isCanceled) { //移除掉已完成或已取消的任务
                const index = this.taskQueue.indexOf(task);
                if (index !== -1)
                    this.taskQueue.splice(index, 1);
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

    destroy() {
        AnimationFrameUpdater.instance.remove(this.update);
        this.taskQueue.length = 0;
        super.destroy();
    }
};

let _instance;

Object.defineProperties(TaskPool, {
    instance: {
        configurable: false,
        get: function () {
            if (!_instance)
                _instance = new TaskPool();
            return _instance;
        }
    }
});

export {
    TaskPool,
    Task
};