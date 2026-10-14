import {
    readAsText,
    readAsArrayBuffer,
    readAsDataURL
} from './FileRead.js';

/**
 * 触发文件输入
 * @param {Function} callback 回调函数
 * @returns {Promise<File>}
 */
function inputFile(callback) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';

        function cleanup() {
            input.removeEventListener('change', onInput, false);
            input.removeEventListener('cancel', onCancel, false);
        }

        function onInput() {
            cleanup();
            if (input.files.length > 0) {
                const file = input.files[0];
                if (callback)
                    callback(file);
                resolve(file);
            } else {
                reject(new Error('file selection canceled'));
            }
        }

        function onCancel() {
            cleanup();
            reject(new Error('file selection canceled'));
        }

        input.addEventListener('change', onInput, false);
        input.addEventListener('cancel', onCancel, false);

        input.click();
    });
}

/**
 * 触发文件输入并读取文本
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @param {String} encoding 文本编码
 * @returns {Promise}
 */
function inputFileAsText(onLoad, onError, encoding) {
    return new Promise((resolve, reject) => {
        inputFile().then((file) => {
            readAsText(file, onLoad, onError, encoding).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * 触发文件输入并读取ArrayBuffer
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function inputFileAsArrayBuffer(onLoad, onError) {
    return new Promise((resolve, reject) => {
        inputFile().then((file) => {
            readAsArrayBuffer(file, onLoad, onError).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * 触发文件输入并读取DataURL
 * @param {Function} onLoad 加载完成回调函数
 * @param {Function} onError 加载出错回调函数
 * @returns {Promise}
 */
function inputFileAsDataURL(onLoad, onError) {
    return new Promise((resolve, reject) => {
        inputFile().then((file) => {
            readAsDataURL(file, onLoad, onError).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
            });
        }).catch((error) => {
            reject(error);
        });
    });
}

export {
    inputFile,
    inputFileAsText,
    inputFileAsArrayBuffer,
    inputFileAsDataURL,
};
