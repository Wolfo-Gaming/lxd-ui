const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')
const { db } = require('../..')
const foreachExtra = require('foreach-extra')
const { pushInstancestoDB } = require('../../lib/cache')
const prettybytes = require('pretty-bytes')
const { readdirSync } = require('fs')
const { normalize } = require('path')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req,res) => {
    var instances = []
    await pushInstancestoDB()
    foreachExtra(await db.listNodes(), async (node, index, cb) => {
            var a = node.instances.map(inst => {
                //console.log(inst)
         
                return {...inst, node:node.name, node_id: node._id, logo: readdirSync(normalize(__dirname + "/../../public/images/distro")).find(e => e.includes(inst.config["image.os"].toLowerCase())) ? readdirSync(normalize(__dirname + "/../../public/images/distro")).find(e => e.includes(inst.config["image.os"].toLowerCase())) : "", ip: inst.state.network ? inst.state.network["eth0"].addresses.find((address) => {
                    return (address.scope == "global" && address.family == "inet")
                }).address : "0.0.0.0"}
            })
            
            instances = instances.concat(a)
            cb()
    
    })
    //console.log(JSON.stringify(instances))
    res.render('client', {
        instances: instances,
        theme: req.user.metadata.theme,
        user: req.user
    })
}