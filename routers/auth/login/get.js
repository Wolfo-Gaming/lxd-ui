const { db } = require('../../../index')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req,res) => {
    //console.log(req.user)
    if (req.user) return res.redirect('/client')
    res.render('auth/login')
}