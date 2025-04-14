/**
 * 为html页面添加一个css文件
 * @param {String} url css文件地址
 * @returns {Promise}
 */
function appendCss(url) {
    if (!url) return Promise.reject(new Error('appendCss: url is required'));
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.async = true;
        link.href = url;
        link.rel = 'stylesheet';
        link.type = 'text/css';

        const head = document.getElementsByTagName('head')[0];
        link.onload = function () {
            link.onload = undefined;
            link.onerror = undefined;
            resolve(url);
        };
        link.onerror = function (e) {
            link.onload = undefined;
            link.onerror = undefined;
            reject(e);
            head.removeChild(link);
        };

        head.appendChild(link);
    });
}

export default appendCss;
export { appendCss };