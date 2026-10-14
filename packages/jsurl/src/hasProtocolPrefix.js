const pattern = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

function hasProtocolPrefix(url) {
    return pattern.test(url);
};

export default hasProtocolPrefix;
export { hasProtocolPrefix };