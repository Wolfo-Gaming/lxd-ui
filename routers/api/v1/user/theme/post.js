const { db } = require('../../../../../index');
const { Server } = require('../../../../../lib/server');
/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
module.exports = async (req, res) => {
    //console.log(user)
    var user = req.user;
    var current_theme = user.metadata.theme;
    //console.log(current_theme)
    if (current_theme == "pterodactyl") {
        var newtheme = "pterodactyl-dark";
    } else {
        var newtheme = "pterodactyl";
    }
    //console.log(newtheme)
    await db.editUser(user._id, {
        metadata: {
            theme: newtheme
        }
    })
    res.json({
        status: "success",
        message: "Theme changed"
    })
}
