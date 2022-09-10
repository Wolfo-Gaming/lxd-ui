const { hash } = require('./hasher')
const { MongoClient, ObjectId } = require('mongodb');
module.exports = { exports }
module.exports = class DatabaseClient {
    constructor(uri, database) {
        this.uri = uri;
        this.database;
        this.databaseName = database
        this.connected = false;
        this.conn = new MongoClient(this.uri)
    }
    async connect() {
        if (this.connected) return this;
        await this.conn.connect()
        this.connected = true;
        this.database = this.conn.db(this.databaseName)
        return this;
    }
    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {{}} metadata 
     * @returns {Promise<ObjectId>}
     */
    createUser(email, password, metadata) {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('users');
            users.insertOne({
                email: email,
                password: await hash(password),
                metadata: metadata
            }).then(value => {
                console.log('Created user ' + email)
                resolve(value.insertedId)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
     * 
     * @param {string} id 
     * @returns {Promise<number>}
     */
    deleteUser(id) {
        return new Promise((resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('users');
            users.deleteOne({
                _id: new ObjectId(id)
            }).then(value => {
                console.log('Deleted '+ value.deletedCount + " user(s)")
                resolve(value.deletedCount)
            }).catch(err => {
                reject(err)
            })
        })
    }
    editUser(id, data) {
        return new Promise((resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('users');
            users.updateOne({ "_id": new ObjectId(id) }, { "$set": data }).then(value => {
                console.log('Modified '+ value.modifiedCount + " user(s)")
                
                resolve(value.modifiedCount)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
     * 
     * @param {string} id 
     * @returns {import('mongodb').WithId<import('mongodb').Document>}
     */
    fetchUser(id) {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('users');
            resolve(await users.findOne({ "_id": new ObjectId(id) }))
        })
    }
    /**
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {{}} metadata 
 * @returns {Promise<ObjectId>}
 */
    createNode(name, metadata) {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            users.insertOne({
                name: name,
                metadata: metadata
            }).then(value => {
                resolve(value.insertedId)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
* 
* @param {string} id 
* @returns {Promise<number>}
*/
    deleteNode(id) {
        return new Promise((resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            users.deleteOne({
                _id: new ObjectId(id)
            }).then(value => {
                resolve(value.deletedCount)
            }).catch(err => {
                reject(err)
            })
        })
    }
    editNode(id, data) {
        return new Promise((resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            users.updateOne({ "_id": new ObjectId(id) }, { "$set": data }).then(value => {
                resolve(value.deletedCount)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**
 * 
 * @param {string} id 
 * @returns {Promise<import('mongodb').WithId<import('mongodb').Document>>}
 */
    fetchNode(id) {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            resolve(await users.findOne({ "_id": new ObjectId(id) }))
        })
    }
        /**
 * @returns {Promise<import('mongodb').WithId<import('mongodb').Document>[]>}
 */
    listNodes() {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            resolve((await users.find()).toArray())
        })
    }
    updateNodeInstances(id, instances) {
        return new Promise((resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            users.updateOne({ "_id": new ObjectId(id) }, { "$set": {instances: instances} }).then(value => {
                resolve(value.deletedCount)
            }).catch(err => {
                reject(err)
            })
        })
    }
    /**@returns {Promise<import('@wolfogaming/node-lxd/src/types/configs/instance').InstanceMeta[]>} */
    fetchNodeInstances(id) {
        return new Promise(async (resolve, reject) => {
            if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
            var users = this.database.collection('nodes');
            resolve((await users.findOne({ "_id": new ObjectId(id) })).instances)
        })
    }
       /**
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {{}} metadata 
 * @returns {Promise<ObjectId>}
 */
        createImageServer(name, metadata) {
            return new Promise(async (resolve, reject) => {
                if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
                var users = this.database.collection('imageservers');
                users.insertOne({
                    name: name,
                    metadata: metadata
                }).then(value => {
                    resolve(value.insertedId)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        /**
    * 
    * @param {string} id 
    * @returns {Promise<number>}
    */
        deleteImageServer(id) {
            return new Promise((resolve, reject) => {
                if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
                var users = this.database.collection('imageservers');
                users.deleteOne({
                    _id: new ObjectId(id)
                }).then(value => {
                    resolve(value.deletedCount)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        editImageServer(id, data) {
            return new Promise((resolve, reject) => {
                if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
                var users = this.database.collection('imageservers');
                users.updateOne({ "_id": new ObjectId(id) }, { "$set": data }).then(value => {
                    resolve(value.deletedCount)
                }).catch(err => {
                    reject(err)
                })
            })
        }
        /**
     * 
     * @param {string} id 
     * @returns {Promise<import('mongodb').WithId<import('mongodb').Document>>}
     */
        fetchImageServer(id) {
            return new Promise(async (resolve, reject) => {
                if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
                var users = this.database.collection('imageservers');
                resolve(await users.findOne({ "_id": new ObjectId(id) }))
            })
        }
            /**
     * @returns {Promise<import('mongodb').WithId<import('mongodb').Document>[]>}
     */
        listImageServers() {
            return new Promise(async (resolve, reject) => {
                if (!this.connected) return reject(new Error('DB Client not connected!. Run DatabaseClient.connect() before performing operations.'))
                var users = this.database.collection('imageservers');
                resolve((await users.find()).toArray())
            })
        }
}