const dataManager = require('../../modules/dataManager');

module.exports = checkCookieForPrivatePage = async function ( req, res, next ) {
    const userId = req.cookies.userId;

    if (!userId) {
       return  res.redirect('/login')
    } else {
        await dataManager.getAllUsers().then( data => {
            const found = data.some( user =>  user.id === userId );
            found ? next() : res.redirect('/login');
        });
    }
};
