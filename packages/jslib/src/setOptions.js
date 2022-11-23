import getPropertyDescriptor from './getPropertyDescriptor.js';

function setOptions(target, options) {
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
        else if (target[key] && typeof target[key].setOptions === 'function') {
            target[key].setOptions(value);
        }
    });

    return target;
}

export default setOptions;