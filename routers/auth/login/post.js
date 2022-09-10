const { db , passport} = require('../../../index')
/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req,res) => {
    passport.authenticate('local', {"failureRedirect":"/auth/login?err=wrongpassword","successRedirect": "/client"})(req,res)
}