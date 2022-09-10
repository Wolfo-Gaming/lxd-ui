const expressWs = require('express-ws');
const { db, sessions, wsServer } = require('../../../../index');
const { Server } = require('../../../../lib/server');
/**
 * @param {import('express').Request} req 
 * @param {import('ws').WebSocket} ws
 */
module.exports = async (ws, req) => {
    if (!req.query.id) return;
    var id = req.query.id;
    if (!sessions.get(id)) return;
    /**
     * @type {import('ws').WebSocket}
     */
    var control = sessions.get(id).control
    control.on('message', (data) => {
        ws.send(data.toString())
    })
    ws.on('message', (data) => {
        control.send(data)
    })
    ws.on("close", () => {
        ws.close()
        control.close()
    })
        
    control.on('close' , () => {
        ws.close()
        control.close()
    })
}