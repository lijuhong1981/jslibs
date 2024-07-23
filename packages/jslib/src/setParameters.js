import getPropertyDescriptor from './getPropertyDescriptor.js';

/**
 * 为对象设置参数
 * @param {Object} target 设置的对象
 * @param {Object} parameters 设置的参数
 * @returns {Object} 设置后的对象
 */
function setParameters(target, parameters) {
    if (!target || !parameters)
        return;
    // console.log('target:', target, 'parameters:', parameters);

    Object.keys(parameters).forEach((key) => {
        if (!parameters.hasOwnProperty(key)) //过滤继承变量
            return;
        if (key.startsWith('_')) //过滤私有变量
            return;

        const value = parameters[key];

        /**
         * 这里要先获取变量描述信息，以判断该变量是否可赋值
         * 可赋值的变量直接赋值
         * 不可赋值的变量再判断是否存在setParameters或setOptions函数，存在则通过调用这2个函数赋值
        */
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