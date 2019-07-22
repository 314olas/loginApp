const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const dataManager = require('./modules/dataManager');
const checkCookieForHomePage = require('./modules/middlewares/checkCookieForHomePage');
const checkCookieForPrivatePage = require('./modules/middlewares/checkCookieForPrivate');
const checkCookieForLoginPage = require('./modules/middlewares/checkCookieForLoginPage');
const loginManager = require('./modules/checkUserLoginManager');
let resetPassword = require('./modules/resetPassword');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const maxAge = 1000 * 60 * 60 * 2;

app.get('/cash', (req, res) => {
    res.json(dataManager.getCash());
});

app.get('/', checkCookieForHomePage, (req, res) => {
    res.redirect('/private');
});

app.get('/getUsers',  (req, res) => {
    dataManager.getAllUsers().then((data) => {
       res.json(data)
   });
});

app.get('/getUser/:id', (req, res) => {
    dataManager.getUser(req.params.id).then(data => {
        res.status(data.status).json(data.msg)
    });
});

app.get('/private', checkCookieForPrivatePage, ( req, res ) => {
    res.status(200).send('<h1>Welcome</h1><a href="/logout">Logout</a>')
});

app.delete('/deleteUser/:id', (req, res) => {
    dataManager.deleteUser(req.params.id).then(data => {
       res.json(data)
   });
});

app.get('/reset-password-success', ( req,res ) => {
    res.sendFile(__dirname + '/public/pages/resetPassword/reset-password-success.html')
})

app.route('/resetPassword/step2/:id')
    .get( ( req, res ) => {
        res.sendFile(__dirname + '/public/pages/resetPassword/reset-password-step2.html')
    })
    .put( ( req, res ) => {
        dataManager.updateUser(req.params.id, req.body ).then( data => {
            res.status(data.status).json(data.msg);
        })
    });

app.route('/resetPassword/step1')
    .get( ( req, res ) => {
        res.sendFile(__dirname + '/public/pages/resetPassword/reset-password-step1.html');
    })
    .post( ( req, res ) => {
      new resetPassword(req.body).resetPasswordStep1().then( data => {
          res.status(data.status).json(data.msg);
      });
    });

app.get('/logout', ( req, res ) => {
    res.clearCookie('userId');
    res.redirect('/login');
});

app.route('/login')
    .all(checkCookieForLoginPage)
    .get( checkCookieForLoginPage, ( req, res )  => {
        res.sendFile(__dirname + '/public/pages/login.html');
    })
    .post(( req, res ) => {
        loginManager(req.body).then(data => {
            if (data.cookie) {
                res.cookie('userId', data.cookie, { maxAge: maxAge });
                res.status(data.status).json(data.msg);
            } else {
                res.status(data.status).json(data.msg)
            }
        })
    });

app.route('/registration')
    .all()
    .get((req, res) => {
        res.sendFile(__dirname + '/public/pages/registration.html');
    })
    .post( (req, res) => {
    if (req.body) {
        dataManager.writeData(req.body).then((data) => {
            if (data.status === 201){
                dataManager.getAllUsers().then( users => {
                    const isMatch = dataManager.checkEmailIn(req.body.email, users);
                    if (isMatch) {
                        const user = users.filter(user => user.email === req.body.email);
                        res.cookie('userId', user[0].id, { maxAge: maxAge });
                        res.status(data.status).json(data.msg);
                    } else {
                        res.status(data.status).json(data.msg);
                    }
                });
            } else {
                res.status(data.status).json(data.msg);
            }
        });
    } else {
        res.status(400).send('body request is empty');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`server started on ${PORT}`));

