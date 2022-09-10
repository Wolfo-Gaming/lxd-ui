const { db } = require('../../../../../../index');
const { Server } = require('../../../../../../lib/server');
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    if (!req.params.name) return res.status(404).json({ status: "error", message: "Instance name not present" });
    var nodes = await db.listNodes()
    var node = nodes.find(node => {
        if (node.instances.find(instance => { return instance.name == req.params.name })) {
            return true
        } else {
            return false;
        }
    })
    if (!node)return res.status(404).json({ status: "error", message: "Instance not found" });
    var instance = new Server(node.metadata.url,node.metadata.auth.key,node.metadata.auth.certificate).client;
    var e = (await instance.fetchInstance(req.params.name))
    console.log("Fetch state for " + e.name())
    console.log(e.meta.status)
    if(!e.meta.state.network && e.meta.status != "running") {
        res.json({...await e.fetchUsage(), ip: "0.0.0.0"})
    } else {
       
        res.json({...await e.fetchUsage(), ip: await e.fetchIP()})
    }

    //if (!e.meta.state.network)
}
