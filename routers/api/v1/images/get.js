const { default: axios } = require('axios');
const { db } = require('../../../../index');
const { Server } = require('../../../../lib/server');
var forEach = require("foreach-extra")
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    db.listImageServers().then(servers => {
        var images = [];
        forEach(servers, async (server, index, cb) => {
            var response = await axios.get(server.url + 'streams/v1/images.json')
           // console.log(response)
            var data = response.data
            var e = Object.keys(data.products).map(key => {
                return {
                    name: key,
                    ...data.products[key]
                }
            })
            images = images.concat(e);
            cb()
        })


        res.json(images);
    })
}
