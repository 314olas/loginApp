const dataManager = require('../modules/dataManager');

module.exports = async function loginUserManager(obj) {
    let response = null;
    await dataManager.getAllUsers().then( data => {
        const EmailCoincidenceUser = data.filter(user => user.email === obj.email)[0];
        if (EmailCoincidenceUser) {
            if (EmailCoincidenceUser.password === obj.password) {
                response = { cookie: EmailCoincidenceUser.id, status: 200, msg: { text: 'loggin success ', isRedirect: true, redirectPath: '/private'}}
            } else {
                response = { status: 404, msg: { text: 'wrong password', isRedirect: false} }
            }
        } else {
            response = { status: 404, msg: { text: 'user not found', isRedirect: false} }
        }
    });

    return response
};
