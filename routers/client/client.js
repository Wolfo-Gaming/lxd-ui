const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')

require('express-ws')(router)
router.use(ensureLogin.ensureLoggedIn("/auth/login"))
router.get('/', require('./get'))
router.get('/instances/:name', require('./instances/[name]/get'))
router.get('/instances/:name/console', require('./instances/[name]/console/get'))
router.get('/images', require('./images/get'))
router.get('/networks', require('./networks/get'))
router.get('/networks/:name', require('./networks/[name]/get'))
module.exports = router