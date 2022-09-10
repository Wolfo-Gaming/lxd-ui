const foreachExtra = require('foreach-extra');
const { db } = require('../../..');
const { Server } = require('../../../lib/server');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    var nodes = await db.listNodes()
    var networks = []
    foreachExtra(nodes, async (networkd, index, cb) => {
        //console.log(networkd)
        if (!networkd) return cb();
        var instance_client = new Server(networkd.metadata.url, networkd.metadata.auth.key, networkd.metadata.auth.certificate).client;
        var networkss = await instance_client.fetchNetworks()
        //console.log(networkss)
        var e = networkss.map(network => {
            return {
                ...network.meta,
                node: networkd.name,
                node_id: networkd._id
            }
        }).filter(network => {return network.managed == true})
        networks = networks.concat(e)
        if (index == nodes.length - 1) {
          //  console.log(networks)

            res.render('networks', {
                networks,
                theme: req.user.metadata.theme,
                user: req.user
            })
            cb()
        } else {
            cb()
        }
    })

}