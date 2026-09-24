import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import isArray from "@lijuhong1981/jscheck/src/isArray.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import isNumber from "@lijuhong1981/jscheck/src/isNumber.js";
import isString from "@lijuhong1981/jscheck/src/isString.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import Log from "@lijuhong1981/jslib/src/Log.js";
import now from "@lijuhong1981/jstime/src/now.js";
import Field from "./Field.js";
import Vector from "./Vector.js";

const defaultColors = Object.freeze([
    'rgb(36,104, 180)',
    'rgb(60,157, 194)',
    'rgb(128,205,193 )',
    'rgb(151,218,168 )',
    'rgb(198,231,181)',
    'rgb(238,247,217)',
    'rgb(255,238,159)',
    'rgb(252,217,125)',
    'rgb(255,182,100)',
    'rgb(252,150,75)',
    'rgb(250,112,52)',
    'rgb(245,64,32)',
    'rgb(237,45,28)',
    'rgb(220,24,32)',
    'rgb(180,0,35)',
]);

const defaultOptions = Object.freeze({
    globalAlpha: 0.9, //canvas全局alpha
    lineWidth: 1, //线宽
    colors: defaultColors, //颜色设置
    velocityScale: 1.0, //速度缩放倍率
    maxAge: 90, //粒子最大存活帧数
    particlesCount: 2000, //粒子数量
    frameDeltaTime: 1000 / 30, //动画帧渲染间隔时间
    useAnimationFrame: true, //是否使用动画帧
    unit: 'degrees', //粒子位置单位，支持'degrees'(经纬度),'pixel'(像素)等
    enableLog: false, //是否启用日志
});

function formatData(data, log) {
    log.time('format-data');
    let uComponent, vComponent;
    data.forEach(function (record) {
        switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
            case "1,2":
            case "2,2":
                uComponent = record;
                break;
            case "1,3":
            case "2,3":
                vComponent = record;
                break;
        }
    });
    if (!vComponent || !uComponent)
        throw new Error('formatData failed, vComp or uComp undefined.');
    const header = uComponent.header;
    const field = new Field({
        xmin: header.lo1,
        ymin: header.la1,
        xmax: header.lo2,
        ymax: header.la2,
        deltaX: header.dx,
        deltaY: header.dy,
        colsNumber: header.nx,
        rowsNumber: header.ny,
        uDatas: uComponent.data,
        vDatas: vComponent.data
    }, log);
    log.timeEnd('format-data');
    return field;
};

function indexFor(value, min, max, array) {
    const maxIndex = array.length - 1
    return Math.max(0, Math.min(maxIndex, Math.round((value - min) / (max - min) * maxIndex)));
}

class WindField extends Destroyable {

    constructor(canvas, options = {}) {
        super();
        if (isString(canvas))
            canvas = document.getElementById(canvas);
        Check.instanceOf('canvas', canvas, HTMLCanvasElement);
        this.canvas = canvas;
        this.log = new Log();
        this.setOptions(options);
        this.update = this.update.bind(this);
        this.particles = [];
        this._oldTime = 0;
    }

    setOptions(options) {
        if (!options)
            return;
        this.options = Object.assign({}, defaultOptions, this.options, options);
        this.log.enabled = this.options.enableLog;
        this.needsPrepareParticles = true;
        return this;
    }

    setData(data) {
        if (!data)
            return;

        let field;
        if (isArray(data))
            field = formatData(data, this.log);
        else if (data instanceof Field)
            field = data;
        else
            throw new Error('Illegal data ' + data);

        this.field = field;
        this.needsPrepareParticles = true;
        this.log.log('field data changed, need reset particles.');
        return this;
    }

    randomAge() {
        return Math.floor(Math.random() * this.options.maxAge);
    }

    // unproject(pixelCoords) { }

    // project(lnglatCoords) { }

    prepareParticles() {
        this.particles.length = 0;
        if (this.field) {
            const particlesCount = isFunction(this.options.particlesCount) ? this.options.particlesCount(this) : this.options.particlesCount;
            const width = this.canvas.width, height = this.canvas.height;
            for (let i = 0; i < particlesCount; i++) {
                this.particles.push(this.field.randomParticle({
                    age: this.randomAge(),
                }, this.options.unit, width, height));
            }
        }
        return this.particles;
    }

    _moveParticles(deltaTime) {
        const width = this.canvas.width, height = this.canvas.height;
        const maxAge = this.options.maxAge;
        const velocityScale = isFunction(this.options.velocityScale) ? this.options.velocityScale(deltaTime) : this.options.velocityScale;
        this.particles.forEach(particle => {
            if (particle.age > maxAge) {
                particle.age = this.randomAge();
                this.field.randomParticle(particle, this.options.unit, width, height);
            }
            const x = particle.x;
            const y = particle.y;
            const vector = this.field.calculateParticleVector(particle, width, height);
            if (!vector) {
                particle.age = maxAge;
            } else {
                const velocity = deltaTime / 1000;
                const tx = x + vector.u * velocityScale * velocity;
                const ty = y + vector.v * velocityScale * velocity;
                particle.tx = tx;
                particle.ty = ty;
                particle.m = vector.m;
                // if (this.field.isOutOfBounds(tx, ty))
                //     particle.age = maxAge;
            }
            particle.age++;
        });
    }

    _drawParticles() {
        const context = this.canvas.getContext('2d');
        context.globalCompositeOperation = 'destination-in';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = this.options.globalAlpha;
        context.lineWidth = (isNumber(this.options.lineWidth) ? this.options.lineWidth : 1);
        context.strokeStyle = (isString(this.options.colors) ? this.options.colors : '#f00');
        if (this.field && this.particles.length > 0) {
            const range = this.field.valueRange;
            const minValue = getValidValue(this.options.minValue, range[0]);
            const maxValue = getValidValue(this.options.maxValue, range[1]);
            this.particles.forEach(particle => {
                this._drawParticle(context, particle, minValue, maxValue);
                particle.x = particle.tx;
                particle.y = particle.ty;
            });
        }
    }

    _drawParticle(context, particle, minValue, maxValue) {
        const width = this.canvas.width, height = this.canvas.height;
        const pixelCoords = this.field.calculateParticlePixelCoords(particle, width, height);
        context.beginPath();
        context.moveTo(pixelCoords[0], pixelCoords[1]);
        context.lineTo(pixelCoords[2], pixelCoords[3]);
        if (isFunction(this.options.colors)) {
            context.strokeStyle = this.options.colors(particle.m);
        } else if (isArray(this.options.colors)) {
            const colorIdx = indexFor(particle.m, minValue, maxValue, this.options.colors);
            context.strokeStyle = this.options.colors[colorIdx];
        }
        if (isFunction(this.options.lineWidth)) {
            context.lineWidth = this.options.lineWidth(particle.m);
        }
        context.stroke();
    }

    _render(deltaTime) {
        this._moveParticles(deltaTime);
        this._drawParticles();
    }

    update() {
        if (this.isStoped)
            return;
        if (this.options.useAnimationFrame)
            this.animationFrameHandle = requestAnimationFrame(this.update);
        if (this.needsPrepareParticles) {
            this.prepareParticles();
            this.needsPrepareParticles = false;
        }
        const newTime = now();
        const deltaTime = newTime - this._oldTime;
        if (deltaTime > this.options.frameDeltaTime) {
            this._oldTime = newTime;
            this._render(deltaTime);
            return true;
        }
        return false;
    }

    startRender() {
        if (this.isStarted)
            return;
        this.isStoped = false;
        this.isStarted = true;
        this._oldTime = now();
        this.update();
        return this;
    }

    stopRender() {
        if (isValid(this.animationFrameHandle))
            cancelAnimationFrame(this.animationFrameHandle);
        this.isStoped = true;
        this.isStarted = false;
        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.stopRender();
        if (this.field)
            this.field.destroy();
    }
};

WindField.Vector = Vector;
WindField.Field = Field;
WindField.defaultOptions = defaultOptions;

export default WindField;
export { WindField, defaultOptions, defaultColors };
