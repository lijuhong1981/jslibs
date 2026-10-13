/**
 * 生成GUID（UUID v4）
 * @returns {string}
*/
const generateGUID = (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') ?
    function () {
        // 使用密码学安全随机数生成 UUID v4
        // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
        const buf = new Uint16Array(8);
        globalThis.crypto.getRandomValues(buf);
        // 设置 version 位（第 3 段首字符为 4）与 variant 位（第 4 段首字符为 8~b）
        buf[3] = (buf[3] & 0x0fff) | 0x4000;
        buf[4] = (buf[4] & 0x3fff) | 0x8000;
        function S4(num) {
            let ret = num.toString(16);
            while (ret.length < 4) {
                ret = "0" + ret;
            }
            return ret;
        };
        return (S4(buf[0]) + S4(buf[1]) + "-" + S4(buf[2]) + "-" + S4(buf[3]) + "-" + S4(buf[4]) + "-" + S4(buf[5]) + S4(buf[6]) + S4(buf[7]));
    } : function () {
        // 退化方案：使用 Math.random
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

export default generateGUID;
export { generateGUID };
