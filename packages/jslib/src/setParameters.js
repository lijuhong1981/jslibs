import getPropertyDescriptor from './getPropertyDescriptor.js';

/**
 * 为对象设置参数
 * @param {Object} target 设置的对象
 * @param {Object} options 设置的参数
 * @returns {Object} 设置后的对象
 */
function setParameters(target, options) {
    if (!target || !options)
        return;
    // console.log('target:', target, 'options:', options);

    Object.keys(options).forEach((key) => {
        if (!options.hasOwnProperty(key)) //过滤继承变量
            return;
        if (key.startsWith('_')) //过滤私有变量
            return;

        const value = options[key];

        const descriptor = getPropertyDescriptor(target, key);//获取变量描述信息
        // console.log(key, descriptor);
        if (!descriptor || descriptor.writable || descriptor.set)
            target[key] = value;
        else if (target[key]) {
            if (typeof target[key].setParameters === 'function') {
                target[key].setParameters(value);
            } else if (typeof target[key].setOptions === 'function') {//兼容以前的setOptions
                target[key].setOptions(value);
            }
        }
    });

    return target;
}

export default setParameters;