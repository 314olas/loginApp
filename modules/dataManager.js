const promisify = require('util').promisify;
const fs = require('fs');
const uuid = require('uuid');
const responsHelper = require('./helpers/madeResponseObject');

class DataManager {
    constructor(){
        this.filepath = './users.json';
        this.readFilePr =  promisify(fs.readFile);
        this.writeFilePr = promisify(fs.writeFile);
        this.cash = null;
    }

    getCash(){
        return this.cash;
    }

    checkEmailIn(email, arr) {
        return  arr.some(user => user.email === email);
    }

    giveUserById(id, data){
        const found = data.some(user => user.id === id);
        if (found) {
            return responsHelper(200, 'found user', undefined, undefined, data.filter(user => user.id === id)[0] )
        } else {
            return responsHelper(404, 'User not found');
        }
    }

    async readData() {
           if (this.cash) {
               return await this.cash;
           } else {
               return await this.readFilePr(this.filepath, 'utf-8')
                   .then(data =>  {
                           this.cash = data;
                           if (this.cash) {
                               return this.cash = JSON.parse(data);
                           } else {
                               return this.cash;
                           }
                       },
                       () => { throw responsHelper( 404, 'can\'t get users', true, '/page404' ) }
                   );
           }
    }

    async getAllUsers(){
        try {
            await this.readData();
            return this.cash;
        } catch (e) {
            return  e
        }
    }

    async writeData(reqBody){
        const newUser = {
            name: reqBody.name,
            id: uuid(),
            password: reqBody.password,
            isAccess: 'false',
            dateActivation: new Date().toUTCString(),
            email: reqBody.email,
        };

        if ( !newUser.name || !newUser.email || !newUser.password ) {
            return responsHelper(400, 'please fill all fields');
        }

        try {
            await this.readData();

            const isEmail = this.checkEmailIn( reqBody.email, this.cash);
            if (isEmail) {
                return responsHelper(400, 'this email already used');
            }

            this.cash.push(newUser);
            await this.writeFilePr(this.filepath, JSON.stringify(this.cash));
            this.cash = null;
            return responsHelper( 201,'success', true, '/private' );
        } catch (e) {
            return e;
        }
    }

    async getUser(id){

        try {
            await this.readData();
            return  this.giveUserById(id, this.cash);
        } catch (e) {
            return e;
        }
    }

    async deleteUser(id){
        try {
            await this.readData();
            let resp = responsHelper(204,'user not found' );
            this.cash.forEach( (item, i) => {
                if (item.id === id.toString()) {
                    const deletedUser = this.cash.splice(i, 1);
                    this.writeFilePr(this.filepath, JSON.stringify(this.cash));
                    resp = responsHelper(200, 'deleted', false, undefined, deletedUser[0] );
                }
            });
            return resp;
        } catch (e) {
            return e;
        }
    }

    async updateUser( id, updateObj ){
        try {
            await this.readData();
            let isMatchPassword = false;
            let userUpdated = null;
            // const newArr =
            let newUsers = [];
            this.cash.forEach( user => {
                 if (user.id === id) {
                     userUpdated = user;
                     for (let key in updateObj ){

                         if (user[key] && user[key] !== updateObj[key]) {
                             user[key] = updateObj[key];
                             newUsers.push(user);

                         } else {
                             newUsers.push(user);
                             isMatchPassword = true;
                         }
                     }
                 } else {
                     newUsers.push(user)
                 }
            });
            if (isMatchPassword){
                return  responsHelper(400, 'incorrect password')
            } else {
                this.cash = newUsers;
                this.writeFilePr(this.filepath, JSON.stringify(this.cash));
                return responsHelper(200, 'updated', true, '/reset-password-success', {name:userUpdated.name, email:userUpdated.email} )
            }
        } catch (e) {
            return e
        }
    }
}

const data = new DataManager();

module.exports = data;
