const dataManager = require('../../modules/dataManager');

module.exports = checkCookieForLoginPage = async function ( req, res, next ) {
    const userId = req.cookies.userId;

    if (!userId) {
        next()
    } else {
        await dataManager.getAllUsers().then( data => {
            const found = data.some( user =>  user.id === userId );
            found ? res.redirect('/private') : next();
        });
    }
};
