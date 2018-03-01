var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var app = express();
var md5 = require('md5');
var User = require('../../models/user');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;
var Base64 = require('js-base64').Base64;

var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var async = require('async');
var hostServer = libSetting.hostServer;

var nameReg = /^(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|([a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*)$/;
var name1Reg = /([_+.!@#$%^&*();\/|<>"'])+/;
var addressReg = /([+!@#$%^*();\|<>"'])+/;
var numberReg = /^[a-zA-Z0-9]*$/;
var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;


var sendLinkMail = (emailReceive, name, link) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({ // config mail server
            host: 'smtp.gmail.com',
            // port:'465',
            auth: {
                user: 'no-reply@taydotech.com',
                pass: 'taydotech!@#deployapp'
            }
        });
        transporter.use('compile', hbs({
            viewPath: path.join(appRoot, 'views'),
            extName: '.ejs'
        }));

        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'TayDoTech Team',
            to: emailReceive,
            subject: 'Wellcome DeployApp',
            template: './login/mailwellcome',
            context: {
                name,
                link
            }
        }
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                return reject(err);
            }
            resolve('Message sent: ' + info.response);

        });
    });
}

router.get('/register', function (req, res) {
    if (req.session.iduser) {
        res.redirect("/")
    } else {
        res.render('./login/register', {
            title: 'Register'
        });
    }
})
router.get('/profile', function (req, res) {
    res.redirect("/updateinf");
})

router.get('/register/:email', function (req, res, next) {
    try {
        User.update({
            id: Base64.decode(req.query.id)
        }, {
            status: true
        }, (err, data) => {
            if (err) {
                console.log(err)
            }
            res.redirect("/login?status=yes");
        })
    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.send({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });
    }

});
router.post("/register/ok", function (req, res) {
    try {
        // console.log(req.body.username);
        var id = md5(Date.now());
        var query = {
            id: id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            dateCreate: Date.now(),
            email: req.body.email,
            password: md5(req.body.password),
            address: req.body.address,
            country: req.body.country,
            zipcode: req.body.zipcode,
            status: false
        }
        User.findOne({
            username: req.body.username
        }, function (err, result) {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.json({
                        status: "3",
                        message: err + ''
                    });
                else
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });

            }
            if (!result) {
                User.findOne({
                    email: req.body.email
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            status: "3",
                            message: err + ''
                        });
                    }
                    if (!result) {
                        if (req.body.firstname == "") {
                            return res.json({
                                status: "2",
                                message: "Firstname can not be empty"
                            });
                        } else if (req.body.lastname == "") {
                            return res.json({
                                status: "2",
                                message: "Lastname can not be empty"
                            });
                        } else if (req.body.username == "") {
                            return res.json({
                                status: "2",
                                message: "Username can not be empty"
                            });
                        } else if (req.body.email == "") {
                            return res.json({
                                status: "2",
                                message: "Email can not be empty"
                            });
                        } else if (req.body.password == "") {
                            return res.json({
                                status: "2",
                                message: "Password can not be empty"
                            });
                        } else if (req.body.address == "") {
                            return res.json({
                                status: "2",
                                message: "Address can not be empty"
                            });
                        } else if (req.body.zipcode == "") {
                            return res.json({
                                status: "2",
                                message: "Zipcode can not be empty"
                            });
                        } else {
                            var link = hostServer + "/register/:" + req.body.email + "?id=" + Base64.encode(id);
                            return sendLinkMail(req.body.email, req.body.firstname, link).then(() => {
                                User.create(query)
                                return res.json({
                                    status: "1",
                                    message: "success"
                                });
                            }).catch((ex) => {
                                console.log(ex);
                                if (devMode == true)
                                    return res.json({
                                        status: "3",
                                        message: ex + ''
                                    });
                                else
                                    return res.json({
                                        status: "3",
                                        message: 'Oops, something went wrong'
                                    });
                            })
                        }
                    } else {
                        return res.json({
                            status: "2",
                            message: "Username or email already exists"
                        });
                    }
                })
            } else {
                return res.json({
                    status: "2",
                    message: "Username or email already exists"
                });
            }
        })
    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.json({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });

    }
});

module.exports = router;