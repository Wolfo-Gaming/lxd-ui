const { db } = require('..')
const { Server } = require('./server')
function pushInstancestoDB() {
    return new Promise(async (resolve,reject) => {
        for await (const node of await db.listNodes()) {
            try {
                var node_server = (new Server(node.metadata.url, node.metadata.auth.key, node.metadata.auth.certificate)).client
                var node_instances = (await node_server.fetchInstances()).map(inst => {
                    return inst.meta
                })
                db.updateNodeInstances(node._id,node_instances) 
            } catch (error) {
                reject(error)
            }

        }
        resolve()
    })
}
module.exports = {pushInstancestoDB}