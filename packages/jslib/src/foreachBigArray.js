/**
 * 大数组遍历
 * 
 * 如果一个数组的元素量很大，对数组执行遍历则会非常耗时，这可能会导致UI线程阻塞，所以这里设计了这个遍历方法，它会根据指定的循环次数遍历，完成后如果数组未遍历完成，则会根据指定的延迟时间使用setTimeout函数延迟一定时间后再继续遍历数组，以避免UI线程阻塞现象。
 *  
 * @param {Array} array 需要遍历的数组
 * @param {Function} callback 遍历数组元素回调方法
 * @param {Number} maxLoopCount 指定循环最大遍历次数
 * @param {Number} delay 一次循环完成后的延迟时间
 * @returns {Function} 返回取消函数，调用后可取消遍历
 */
function foreachBigArray(array, callback = (element, index) => { }, maxLoopCount = 1000, delay = 10) {
    const arrayLength = array.length;
    let index = 0, canceled = false;

    function cancel() {
        canceled = true;
    }

    function processLoop() {
        const length = Math.min(arrayLength, index + maxLoopCount);
        for (let i = 0; i < length; i++) {
            if (canceled)
                return;
            const element = array[i];
            callback(element, index, arrayLength);
            index++;
        }

        nextLoop();
    }

    function nextLoop() {
        if (canceled)
            return;
        if (index < arrayLength) {
            setTimeout(processLoop, delay);
        }
    }

    processLoop();

    return cancel;
};

export default foreachBigArray;
export { foreachBigArray };