const dataManager = require('../../modules/dataManager');

module.exports = checkCookieForHomePage = async function  ( req, res, next ) {
    const userId = req.cookies.userId;
    if (!userId) {
        res.redirect('/login')
    } else {
        await dataManager.getAllUsers().then( data => {
           const found = data.some( user =>  user.id === userId );
           found ? next() : res.redirect('/login');
        });
    }
};

