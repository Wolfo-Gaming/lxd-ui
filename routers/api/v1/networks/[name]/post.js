const { db } = require('../../../../../index');
const { Server } = require('../../../../../lib/server');
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
 module.exports = async (req, res) => {
    if (!req.params.name) return res.status(404).json({ status: "error", message: "Network name not present" });
    var node_name = req.params.name.split('-')[0]
    var network_name = req.params.name.split('-')[1]
    if (!network_name) return res.status(404).json({ status: "error", message: "Network name not present" });
    if (!node_name) return res.status(404).json({ status: "error", message: "Node name not present" });
    var nodes = await db.listNodes()
    var node = nodes.find(node => { return node.name == node_name })
    if (!node) return res.status(404).json({ status: "error", message: "Network not found" });

    var instance_client = new Server(node.metadata.url, node.metadata.auth.key, node.metadata.auth.certificate).client;
    var net = await instance_client.fetchNetwork(network_name)
    var network = {...net.meta, state: await net.fetchState()}
    //console.log({
    //    query: req.query,
    //    params: req.params,
    //    body: req.body,
    //    rawBody: req.rawbody,
    //})
    net.client.put(`/1.0/networks/${net.meta.name}`, {config:req.body}).then(data => {
        res.json(data)
    }).catch(error => {
        res.status(500).json({ status: "error", message: error })
    });
}
