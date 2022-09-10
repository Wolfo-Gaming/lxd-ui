const foreachExtra = require('foreach-extra');
const { existsSync, readdirSync } = require('fs');
const { normalize } = require('path');
const prettyBytes = require('pretty-bytes');
const { db } = require('../../..');
const { Server } = require('../../../lib/server');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    var nodes = await db.listNodes()
    var images = []
    foreachExtra(nodes, async (noded, index, cb) => {
       // console.log(noded)
        if (!noded) return cb();
        var instance_client = new Server(noded.metadata.url, noded.metadata.auth.key, noded.metadata.auth.certificate).client;
        var imagess = await instance_client.fetchImages()
       // console.log(imagess)
        var e = imagess.map(image => {
            var aliases = [image.meta.update_source.alias]
            return {
                ...image.meta,
                node: noded.name,
                node_id: noded._id,
                aliases: aliases.concat(image.meta.aliases.map(e => {return e.name})).join(','),
                logo: readdirSync(normalize(__dirname + "/../../../public/images/distro")).find(e => e.includes(image.meta.properties.os.toLowerCase())) ? readdirSync(normalize(__dirname + "/../../../public/images/distro")).find(e => e.includes(image.meta.properties.os.toLowerCase())) : ""
            }
        })
        images = images.concat(e)
        if (index == nodes.length - 1) {
            //console.log(images)

            res.render('images', {
                images,
                pretty: prettyBytes,
                theme: req.user.metadata.theme,
                user: req.user
            })
            cb()
        } else {
            cb()
        }
    })

}