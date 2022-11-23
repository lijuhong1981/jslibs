/**
 * 清除canvas内容
 * @param {HTMLCanvasElement} canvas
 * @returns {void}
 */
function clearCanvas(canvas) {
    // const context = canvas.getContext('2d');
    // context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = canvas.height;
};

export default clearCanvas;