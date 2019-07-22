const dataManager = require('../modules/dataManager');
const responsHelper = require('./helpers/madeResponseObject');

class ResetPassword {
    constructor(reqBody){
        this.reqBody = reqBody;
        this.users = null;
        this.userForPasswordReset = {};
    }

    async getUsersFromDataManager(){
       await dataManager.getAllUsers().then( users =>{
            this.users = users;
        })
    }

    async isMatchEmailAndUsername(){
        await this.getUsersFromDataManager();
        const isMatchEmail = this.users.some( user => user.email === this.reqBody.email );
        const isMatchUserName = this.users.some( user => user.name === this.reqBody.name );

        if (isMatchEmail && isMatchUserName){
            this.userForPasswordReset =  this.users.filter( user => user.email === this.reqBody.email )[0];
            return true;
        }
        return true;
    }

    async resetPasswordStep1(){
        let response = responsHelper(404, 'not found');
        await this.isMatchEmailAndUsername().then( () => {
            if (Object.keys(this.userForPasswordReset).length > 0) {
                response = responsHelper(200, 'matched', true, `/resetPassword/step2/${this.userForPasswordReset.id }`)
            }
        });
        return response
    }

    async resetPasswordStep2( id, password ){
        await this.getUsersFromDataManager();
        this.users
    }
}


module.exports =  ResetPassword;
