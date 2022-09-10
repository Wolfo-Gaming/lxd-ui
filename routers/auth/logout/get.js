
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = (req,res) => {
    req.logout(() => {
        res.redirect('/auth/login')
    })
}