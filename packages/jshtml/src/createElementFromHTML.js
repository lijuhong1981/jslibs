/**
 * 根据掺入的HTML文本创建HTMLElement对象
 * @param {String} HTML
 * @returns {HTMLElement}
 */
function createElementFromHTML(HTML) {
    const div = document.createElement('div');
    div.innerHTML = HTML;
    // return div.childNodes[0];
    const domElement = div.childNodes[0];
    div.removeChild(domElement);
    return domElement;
};

export default createElementFromHTML;