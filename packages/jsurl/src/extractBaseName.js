import extractFileName from "./extractFileName.js";

/**
 * 从url中提取不包含扩展名的文件名
 * @param {String} url 传入的url
 * @returns {String} 提取的文件名
 */
function extractBaseName(url) {
    const fileName = extractFileName(url);
    const index = fileName.lastIndexOf('.');
    if (index === -1)
        return fileName;
    return fileName.substring(0, index);
};

export default extractBaseName;
export { extractBaseName };