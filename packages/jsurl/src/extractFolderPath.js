/**
 * 从url中提取目录路径
 * @param {String} url 传入的url
 * @returns {String} 提取到的目录路径
 */
function extractFolderPath(url) {
    const index = url.lastIndexOf('/');
    if (index === -1) return './';
    return url.substring(0, index + 1);
}

export default extractFolderPath;
export { extractFolderPath };