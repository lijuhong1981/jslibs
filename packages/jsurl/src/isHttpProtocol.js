const pattern = /^https?:\/\//i;

function isHttpProtocol(url) {
    return pattern.test(url);
};

export default isHttpProtocol;
export { isHttpProtocol };