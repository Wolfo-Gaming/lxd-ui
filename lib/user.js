
module.exports = {
    serialize(user, done) {
        done(null, user._id)
    },
    deserialize(id, done) {
        const { db } = require('..')
        db.fetchUser(id).then(data => {
            done(null, data)
        })
    }
}