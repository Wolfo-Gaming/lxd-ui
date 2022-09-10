const express = require('express')
const router = express.Router()
require('express-ws')(router)

router.get('/login', require('./login/get'))
router.post('/login', require('./login/post'))
router.get('/logout', require('./logout/get'))
module.exports = router