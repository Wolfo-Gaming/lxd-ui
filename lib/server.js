const lxd = require('@wolfogaming/node-lxd')
module.exports.Server = class Server {
    /**
     * 
     * @param {string} url 
     * @param {string} key 
     * @param {string} cert 
     */
    constructor(url, key, cert) {
        /**@type {import('@wolfogaming/node-lxd').Client} */
        this.client = new lxd.Client(url, {"cert": Buffer.from(cert),key: Buffer.from(key),rejectUnauthorized:false,type:'http'})
    }
}

