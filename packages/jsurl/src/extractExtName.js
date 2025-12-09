import extractFileName from "./extractFileName.js";

/**
 * 从url中提取文件扩展名
 * @param {String} url 传入的url
 * @param {Boolean} containsPoint 是否包含'.'符号，默认true
 * @returns {String} 提取的扩展名
 */
function extractExtName(url, containsPoint = true) {
    const fileName = extractFileName(url);
    const index = fileName.lastIndexOf('.');
    if (index === -1)
        return '';
    return fileName.substring(containsPoint ? index : index + 1);
};

export default extractExtName;
export { extractExtName };