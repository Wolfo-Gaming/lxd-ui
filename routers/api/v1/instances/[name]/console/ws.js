const expressWs = require('express-ws');
const { db, sessions, wsServer } = require('../../../../../../index');
const { Server } = require('../../../../../../lib/server');
/**
 * @param {import('express').Request} req 
 * @param {import('ws').WebSocket} ws
 */
module.exports = async (ws, req) => {
    //console.log("exec")
    if (!req.params.name) {
        //console.log("err1")
        return res.status(404).json({ status: "error", message: "Instance name not present" });
    }
    var nodes = await db.listNodes()
    var node = nodes.find(node => {
        if (node.instances.find(instance => { return instance.name == req.params.name })) {
            return true
        } else {
            return false;
        }
    })
    if (!node){
        //console.log("err2");
    return res.status(404).json({ status: "error", message: "Instance not found" });}
    var instance = await new Server(node.metadata.url,node.metadata.auth.key,node.metadata.auth.certificate).client;
    var exec = await (await instance.fetchInstance(req.params.name)).exec(["/bin/bash"], {
        env: {
            "TERM":"xterm-color"
        }
    });
    var id = sessions.create({control: exec.control, operation: exec.term})
    ws.send(id)
    //console.log(sessions.sessions.length)
    exec.on('data', (data) => {
        //console.log(data)
        ws.send(data, {binary:true})
    })
    ws.on('message', (data) => {
        exec.send(data, {binary: true})
    })
    exec.on('exit', () => {
        sessions.delete(id)
        ws.close()
        exec.close()
    })
    ws.on('close', () => {
        sessions.delete(id)
        exec.close()
    })
}