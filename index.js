const express = require('express')
const DatabaseClient = require('./lib/database')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const { deserialize, serialize } = require('./lib/user')
const hash = require('./lib/hasher');
const colors = require('colors')
console.log = function(...data) {
    process.stdout.write("["+"LOG".blue+"] "+data.join(' ') + "\n")
}
console.error = function(...data) {
    process.stdout.write("["+"ERROR".red+"] "+data.join(' ') + "\n")
}
console.warn = function(...data) {
    process.stdout.write("["+"WARNING".yellow+"] "+data.join(' ') + "\n")
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
module.exports.sessions = {
    /**
     * 
     * @param {{control:import('ws').WebSocket, operation: import('ws').WebSocket}} sess 
     */
    create(sess) {
        var id = makeid(10)
        this.sessions.push({ ...sess, id })
        return id;
    },
    get(id) {
        return this.sessions.find(e => e.id == id)
    },
    delete(id) {
        const array = this.sessions;

        //console.log(array);

        const index = array.indexOf(this.get(id));
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
        this.sessions = array;
    },
    sessions: []
}
require('dotenv').config()
const app = express()
const db = new DatabaseClient(process.env.DATABASE_URL, "panel")

module.exports.wsServer = require('express-ws')(app).getWss()
app.set('view engine', 'ejs')
app.use(express.static('public'))
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
db.connect().then(async () => {
    module.exports.db = db;
    const { deserialize, serialize } = require('./lib/user');
    passport.serializeUser(serialize)
    passport.deserializeUser(deserialize)
    passport.use(new LocalStrategy(function (username, password, done) {
        db.database.collection('users').findOne({ "email": username }).then(async data => {
            if (!data || !data.password) return done(null, false, { message: "Invalid User" })
            hash.compare(password, data.password).then((s) => {
                if (s == true) {
                    console.log('User '+ data.email + " Logged in")
                    return done(null, data)
                } else {
                    console.warn('Incorrect credentials')
                    return done(null, false, { message: "Incorrect password" })
                }
            })

        }).catch(err => {
            console.log(err)
            done(err)
        })
    }));
    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))
    app.use(session({
        secret: process.env.APP_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    const { pushInstancestoDB } = require('./lib/cache');
    module.exports.passport = passport
    app.use('/', require('./routers/index'))
    var listener = app.listen(3000,'0.0.0.0', () => {
        console.log(`App listening on http://${listener.address().address}:${listener.address().port}`)
    })
    await pushInstancestoDB()
    setInterval(async () => {
        await pushInstancestoDB()
    }, 60000);


})