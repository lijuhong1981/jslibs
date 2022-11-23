const now = typeof performance === 'undefined' ?
    function () {
        return Date.now();
    } :
    function () {
        return performance.now();
    };

export default now;