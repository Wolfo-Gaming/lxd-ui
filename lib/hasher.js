const bcrypt = require('bcrypt');

module.exports = {
    hash: (data) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(data, 12).then(hash => {
                resolve(hash)
            }).catch(err => {
                reject(err)
            })
        })
    },
    compare: (data1, data2) => {

            return bcrypt.compare(data1, data2)

    }
}