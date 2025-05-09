/**
 * 获取本地IP地址
 * @returns {Promise}
 */
function getLocalIP() {
    return new Promise((resolve, reject) => {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel(''); // 创建数据通道触发候选收集
        pc.onicecandidate = (e) => {
            if (!e.candidate) {
                reject(new Error("无法获取IP"));
                return;
            }
            if (e.candidate.address)
                resolve(e.candidate.address);
            else {
                const ipRule = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                const ipAddr = ipRule.exec(e.candidate.candidate);
                if (ipAddr && ipAddr.length > 1) {
                    resolve(ipAddr[1]);
                } else {
                    reject(new Error("无法获取IP"));
                }
            }
            pc.close();
        };
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(reject);
    });
};

export default getLocalIP;
export { getLocalIP };