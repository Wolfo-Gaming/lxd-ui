const { readdirSync } = require('fs');
const { normalize } = require('path');
const prettyBytes = require('pretty-bytes');
const { db } = require('../../../..');
const { networks_keys } = require('../../../../keys');
const { Server } = require('../../../../lib/server');

/**
 * 
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
    var network_inst = node.instances.filter(inst => {
        //console.log(inst.expanded_devices["eth0"])
         return inst.expanded_devices["eth0"].network == network_name
         
         }).map(inst => {
            return {...inst, logo: readdirSync(normalize(__dirname + "/../../../../public/images/distro")).find(e => e.includes(inst.config["image.os"].toLowerCase())) ? readdirSync(normalize(__dirname + "/../../../../public/images/distro")).find(e => e.includes(inst.config["image.os"].toLowerCase())) : "" 
            }
         })
    var instance_client = new Server(node.metadata.url, node.metadata.auth.key, node.metadata.auth.certificate).client;
    var net = await instance_client.fetchNetwork(network_name)
    var network = {...net.meta, state: await net.fetchState()}

   // console.log(network_inst)
   
    res.render('networks/index', {
        node_name,
        network,
        network_inst,
        networks_keys,
        pretty: prettyBytes,
        theme: req.user.metadata.theme,
        user: req.user
    })
}