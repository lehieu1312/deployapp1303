var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var md5 = require('md5');
var async = require('async');
var libSetting = require('../../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var User = require('../../../models/user');
var Inforapp = require('../../../models/inforapp');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

var sendLinkMail = (emailReceive, name, nameapp, contentmail, titlemail) => {
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
            subject: titlemail,
            template: './dashboard/myteam/mailadduser',
            context: {
                contentmail,
                nameapp,
                name
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

router.get('/myteam/:idapp', checkAdmin, (req, res) => {

    try {
        Inforapp.findOne({
            idApp: req.params.idapp,
            "idUser.idUser": req.session.iduser
        }).then((data) => {
            if (data) {
                var appuse = {};
                var datamyteam = [];
                try {
                    User.find({
                        "myapp.idApp": req.params.idapp,
                        // "myapp.status": true,
                        status: true,
                    }, function (err, count) {
                        async function rendermyteam() {
                            for (let i = 0; i < count.length; i++) {
                                let getdata = await Inforapp.findOne({
                                    idApp: req.params.idapp
                                }, {
                                    idUser: {
                                        $elemMatch: {
                                            idUser: count[i].id,
                                            status: true
                                        }
                                    },
                                }).exec();
                                datamyteam[i] = {
                                    name: count[i].firstname + " " + count[i].lastname,
                                    email: count[i].email,
                                    picture: count[i].picture,
                                    dateAdded: getdata.idUser[0].dateAdded
                                };
                            }
                            let getdata1 = await Inforapp.findOne({
                                idApp: req.params.idapp
                            }).exec();
                            appuse = {
                                idApp: req.params.idapp,
                                nameApp: getdata1.nameApp
                            }
                            console.log(datamyteam)
                            res.render('./dashboard/myteam/myteam', {
                                title: "My Team",
                                myteam: datamyteam,
                                appuse
                            })
                        }
                        rendermyteam()
                    })
                } catch (error) {
                    console.log(error + "")
                    res.render("error", {
                        title: "Error",
                        error: error + ""
                    })
                }

            } else {
                res.redirect("/dashboard/404")
            }
        })

    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

router.post("/adduser", checkAdmin, (req, res) => {
    try {
        Inforapp.findOne({
            idApp: req.body.idApp
        }, {
            idUser: {
                $elemMatch: {
                    idUser: req.session.iduser,
                    status: true
                }
            }
        }).then((role) => {
            // console.log(role.idUser[0].role)
            if (role.idUser[0].role == 1) {
                Inforapp.findOne({
                    idApp: req.body.idApp
                }).then((infor) => {
                    User.findOne({
                        email: req.body.email,
                        status: true
                    }).then((data) => {
                        if (!data) {
                            return res.json({
                                status: "2",
                                message: "User is not exist"
                            })
                        } else {
                            User.update({
                                email: req.body.email,
                                status: true
                            }, {
                                "$push": {
                                    myapp: {
                                        idApp: req.body.idApp,
                                        nameApp: infor.nameApp,
                                        status: true
                                    }
                                }
                            }, {
                                safe: true,
                                upsert: true
                            }).then(() => {
                                // console.log("---1---")
                                // console.log(data)
                                // console.log("---1---")
                                Inforapp.findOneAndUpdate({
                                    idApp: req.body.idApp
                                }, {
                                    '$push': {
                                        idUser: {
                                            idUser: data.id,
                                            dateAdded: new Date,
                                            status: true
                                        }
                                    }
                                }).then((infor) => {
                                    var contentmail = "You have been added as the manager of the application";
                                    var titlemail = "Add User";
                                    return sendLinkMail(req.body.email, data.firstname, infor.nameApp, contentmail, titlemail).then(() => {
                                        return res.json({
                                            status: "1",
                                            message: req.body.idApp
                                        })
                                    })
                                })
                            })

                        }
                    })
                })
            } else {
                return res.json({
                    status: "2",
                    message: "You can not add users"
                })
            }
        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

router.post("/deleteuser", checkAdmin, (req, res) => {
    try {
        Inforapp.findOne({
            idApp: req.body.idApp
        }, {
            idUser: {
                $elemMatch: {
                    idUser: req.session.iduser,
                    status: true
                }
            }
        }).then((role) => {
            // console.log(role.idUser[0].role)
            if (role.idUser[0].role == 1) {
                User.findOne({
                    email: req.body.email,
                    status: true
                }).then((data) => {
                    if (!data) {
                        return res.json({
                            status: "2",
                            message: "Email is not exist"
                        })
                    } else {
                        User.update({
                            email: req.body.email,
                            status: true
                        }, {
                            "$pull": {
                                myapp: {
                                    idApp: req.body.idApp,
                                }
                            }
                        }, {
                            safe: true,
                            upsert: true
                        }).then(() => {
                            console.log(data)
                            Inforapp.findOneAndUpdate({
                                idApp: req.body.idApp
                            }, {
                                '$pull': {
                                    idUser: {
                                        idUser: data.id,
                                    }
                                }
                            }).then((infor) => {
                                var contentmail = "You have been removed as the manager of the application";
                                var titlemail = "Remove User";
                                return sendLinkMail(req.body.email, data.firstname, infor.nameApp, contentmail, titlemail).then(() => {
                                    return res.json({
                                        status: "1",
                                        message: req.body.idApp
                                    })
                                })
                            })
                        })

                    }
                })
            } else {
                return res.json({
                    status: "2",
                    message: "You can not remove users"
                })
            }
        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})
module.exports = router;