const express = require('express')
const router = express.Router()
require('express-ws')(router)

router.use('/client', require('./client/client'))
router.use('/api/v1', require('./api/api'))
router.use('/auth', require('./auth/auth'))
router.get('/', (req,res) => {
    res.redirect('/auth/login')
})

module.exports = router