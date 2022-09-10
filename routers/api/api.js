const express = require('express')
const router = express.Router()
const ensureLogin = require('connect-ensure-login')
require('express-ws')(router)

router.use(ensureLogin.ensureLoggedIn("/auth/login"))
router.ws("/instances/:name/console", require('./v1/instances/[name]/console/ws'))
router.ws("/events", require('./v1/events/ws'))
router.get('/instances/:name/state', require('./v1/instances/[name]/state/get'))
router.post('/instances/:name/state', require('./v1/instances/[name]/state/post'))
router.get('/images', require('./v1/images/get'))
router.post('/networks/:name', require('./v1/networks/[name]/post'))
router.post('/user/theme', require('./v1/user/theme/post'))
module.exports = router