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
var libSetting = require('../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;
var passport = require('passport');
var passportfb = require('passport-facebook').Strategy,
    passportgg = require('passport-google-oauth2').Strategy,
    passporttw = require('passport-twitter').Strategy;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var User = require('../../models/user');
var http = require('http');
var server = http.Server(app);

router.get('/Login', (req, res) => {
    if (req.session.iduser) {
        res.redirect("/")
    } else {
        res.render('./login/login', {
            title: 'Login'
        });
    }
});
router.get('/Logout', (req, res) => {
    req.session.destroy();
    // res.locals.staticuser = "login";
    res.redirect("/login")
});


router.post("/login/tk", function (req, res) {
    try {
        User.findOne({
            username: req.body.username
        }, function (err, result) {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.send({
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
                return res.send({
                    status: "2",
                    message: "The username or password is incorrect"
                });
            } else {
                if (md5(req.body.password) == result.password) {
                    if (result.status == true) {
                        req.session.fullname = result.firstname + " " + result.lastname;
                        req.session.iduser = result.id;
                        if (req.body.rememberme == "true") {
                            req.session.cookie.maxAge = 259200000;
                        } else {
                            req.session.cookie.expires = false;
                        }
                        // res.locals.staticuser = "logout";
                        return res.send({
                            status: "1",
                            message: "success"
                        });
                    } else {
                        return res.send({
                            status: "2",
                            message: "Please verify your email to log in"
                        });
                    }
                } else {
                    return res.send({
                        status: "2",
                        message: "The username or password is incorrect"
                    });
                }
            }
        });
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

var randomtext = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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
            subject: 'Send new password',
            template: './login/mailresetpass',
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

router.post("/forgot", function (req, res) {
    var firstNameUser;
    var iduser1;
    try {
        User.find({
            email: req.body.email
        }).exec((err, result) => {
            if (err) {
                // console.log(err);
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
            if (result.length > 0) {
                async.each(result, function (kq) {
                    firstNameUser = kq.firstname;
                    iduser1 = kq.id;
                });
            }
            if (result.length == 0) {
                return res.json({
                    status: "2",
                    message: "We have sent you an E-mail with instructions on how to reset your password"
                });
                // console("send!")
            } else {
                var newverifycode = randomtext();
                User.update({
                    email: req.body.email
                }, {
                    verifycode: newverifycode
                }, function (err, data) {
                    if (err) {
                        // console.log(err);
                        if (devMode == true)
                            return res.send({
                                status: "3",
                                message: err + ''
                            });
                        else
                            return res.json({
                                status: "3",
                                message: 'Oops, something went wrong'
                            });
                    }
                    var xverificode = Base64.encode(newverifycode);
                    var xiduser = Base64.encode(iduser1);
                    var link = hostServer + "/forgot" + "/:" + req.body.email + "?verifycode=" + xverificode + "&iduser=" + xiduser;
                    return sendLinkMail(req.body.email, firstNameUser, link).then(() => {
                        return res.json({
                            status: "1",
                            message: "We have sent you an E-mail with instructions on how to reset your password"
                        });
                    }).catch((ex) => {
                        console.log(ex);
                        if (devMode == true)
                            return res.send({
                                status: "3",
                                message: ex + ''
                            });
                        else
                            return res.json({
                                status: "3",
                                message: 'Oops, something went wrong'
                            });
                    })
                });

                setTimeout(function () {
                    User.update({
                        email: req.body.email
                    }, {
                        verifycode: ""
                    }, function (err, data) {
                        if (err) {
                            // console.log(err);
                            if (devMode == true)
                                return res.send({
                                    status: "3",
                                    message: err + ''
                                });
                            else
                                return res.json({
                                    status: "3",
                                    message: 'Oops, something went wrong'
                                });
                        }
                        // console.log(data);
                    })
                }, 180000)
            }
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

function cutfirstname(fullname) {
    var x = fullname.split(' ');
    return x[0];
}

function cutlastname(fullname) {
    var y = "";
    var x = fullname.split(' ');
    for (var i = 1; i < x.length; i++) {
        if (i == 1) {
            var y = x[i];
        } else {
            var y = y + " " + x[i];
        }
    }
    return y;
}


var download = function (uri, filename, callback) {
    request.get(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        var r = request(uri).pipe(fs.createWriteStream("./public/themes/img/profile/" + filename));
        r.on('close', callback);
        r.on('error', function (err) {
            console.log(err)
        })
    });
};

// login with facebook
router.get("/auth/fb", passport.authenticate('facebook', {
    scope: ['email', 'user_friends', 'public_profile']
}));
router.get("/auth/fb/cb", passport.authenticate('facebook', {
        failureRedirect: "/login"
    }),
    (req, res) => {
        req.session.iduser = req.user.id;
        User.findOne({
            id: req.user.id
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                else
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
            }
            if (!result.firstname || !result.lastname || !result.username || !result.email || !result.address || !result.country) {
                res.redirect('/updateinf');
            } else {
                req.session.fullname = result.firstname + " " + result.lastname;
                res.redirect('/');
            }


        })

    });
passport.use(new passportfb({
        clientID: "289141778242525",
        clientSecret: "f786b9c27cdbd37cd2f723ac68630f89",
        callbackURL: hostServer + "/auth/fb/cb",
        profileFields: ['id', 'email', 'first_name', 'last_name', 'gender', 'age_range', 'timezone', 'picture', 'locale']
    },
    (accessToken, refreshToken, profile, done) => {

        User.findOne({
            email: profile._json.email
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true) {
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                } else {
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
                }
                return done(err)
            }
            if (result) {
                return done(null, result);
            } else {
                var namepicture = md5(Date.now()) + '.png';
                download(profile.photos[0].value, namepicture, function () {
                    console.log('Done downloading..');
                });
                var newuser = new User({
                    id: md5(Date.now()),
                    idfb: profile._json.id,
                    username: profile._json.email,
                    email: profile._json.email,
                    firstname: profile._json.first_name,
                    lastname: profile._json.last_name,
                    gender: profile._json.gender,
                    dateCreate: Date.now(),
                    agerange: profile._json.age_range.min,
                    picture: namepicture,
                    locale: profile._json.locale,
                    status: true

                });
                newuser.save((err) => {
                    console.log("passport.session : " + passport.session());
                    return done(null, newuser);
                })
            }

        });

    }
));
//login with google
router.get("/auth/gg", passport.authenticate('google', {
    scope: ['email']
}));
router.get("/auth/gg/cb", passport.authenticate('google', {
        failureRedirect: "/login"
    }),
    (req, res) => {
        console.log("user:" + req.user + "")
        req.session.iduser = req.user.id;
        User.findOne({
            id: req.user.id
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                else
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
            }
            if (!result.firstname || !result.lastname || !result.username || !result.email || !result.address || !result.country) {
                res.redirect('/updateinf');
            } else {
                req.session.fullname = result.firstname + " " + result.lastname;
                res.redirect('/');
            }


        })

    });
passport.use(new passportgg({
        clientID: "1028925617368-uofde8m5ttli7u08j6rbfv04rnjfnhj0.apps.googleusercontent.com",
        clientSecret: "z3wZQA15yWWWw7s4pvVOqS0c",
        callbackURL: hostServer + "/auth/gg/cb",
        passReqToCallback: true
    },
    (request, accessToken, refreshToken, profile, done) => {
        User.findOne({
            email: profile.email
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true) {
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                } else {
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
                }
                return done(err)
            }
            console.log(result);
            if (result) {
                return done(null, result);
            } else {
                // User.findOne({
                //     email: profile.email
                // }, (err, data) => {
                //     if (err) throw err;
                //     if (data) {
                //         console.log(data)
                //         return done(null, data);
                //     } else {
                var namepicture = md5(Date.now()) + '.png';
                download(profile._json.image.url, namepicture, function () {
                    console.log('Done downloading..');
                });
                let newuser = new User({
                    id: md5(Date.now()),
                    idgg: profile.id,
                    username: profile.email,
                    email: profile.email,
                    firstname: cutfirstname(profile.displayName),
                    lastname: cutlastname(profile.displayName),
                    // birthday: profile.birthday,
                    dateCreate: Date.now(),
                    picture: namepicture,
                    gender: profile.gender,
                    status: true
                });
                newuser.save((err) => {
                    return done(null, newuser);
                })
                // }
                // })
            }

        });

    }
));
// login with twitter

router.get("/auth/tw", passport.authenticate('twitter'));
router.get("/auth/tw/cb", passport.authenticate('twitter', {
        failureRedirect: "/login"
    }),
    (req, res) => {
        req.session.iduser = req.user.id;
        User.findOne({
            id: req.user.id
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                else
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
            }
            if (!result.firstname || !result.lastname || !result.username || !result.email || !result.address || !result.country) {
                res.redirect('/updateinf');
            } else {
                req.session.fullname = result.firstname + " " + result.lastname;
                res.redirect('/');
            }


        })

    });
passport.use(new passporttw({
        consumerKey: "TO00gFl8bpJrQZ9XsWaFJt6xo",
        consumerSecret: "2vzqVfWdT8cliURIjxsiJt5rFxDDFTYmbA3BzhT62VgBP5LOtv",
        callbackURL: hostServer + "/auth/tw/cb"
    },
    (token, tokenSecret, profile, done) => {
        User.findOne({
            username: profile._json.screen_name
        }, (err, result) => {
            if (err) {
                console.log(err);
                if (devMode == true) {
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                } else {
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });
                }
                return done(err)
            }
            if (result) {
                return done(null, result);
            } else {
                var namepicture = md5(Date.now()) + '.png';
                download(profile._json.profile_image_url, namepicture, function () {
                    console.log('Done downloading..');
                });
                var newuser = new User({
                    id: md5(Date.now()),
                    idtw: profile.id,
                    firstname: cutfirstname(profile._json.name),
                    lastname: cutlastname(profile._json.name),
                    username: profile._json.screen_name,
                    dateCreate: Date.now(),
                    picture: namepicture,
                    status: true
                });
                newuser.save((err) => {
                    return done(null, newuser);
                })
            }
        });
    }
));
module.exports = router;