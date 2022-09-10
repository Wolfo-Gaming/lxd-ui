const { db } = require('../../../../..');
const { Server } = require('../../../../../lib/server');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req,res) => {
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
    
    var instance_client = new Server(node.metadata.url,node.metadata.auth.key,node.metadata.auth.certificate).client;
    var instance = (await instance_client.fetchInstance(req.params.name)).meta
    // console.log(instance)
    res.render('instances/console', {
        instance,
        theme: req.user.metadata.theme,
        user: req.user
    })
}