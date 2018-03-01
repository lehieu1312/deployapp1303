var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })
var app = express();
var md5 = require('md5');
var User = require('../../models/user');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../models/country');
var Inforapp = require('../../models/inforapp');
var TrafficModel = require('../../models/traffic');
var hostServer = libSetting.hostServer;
var fs = require('fs');
var server = require('http').Server(app);
var io = require("socket.io")(server);
var moment = require("moment")
// server.listen(3000)


function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.post('/getaccount', (req, res) => {
    try {
        if (req.session.iduser) {
            User.findOne({
                id: req.session.iduser
            }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                if (!data.picture) {
                    return res.json({
                        picture: "/themes/img/dashboard/Avatar.png",
                        fullname: data.firstname + " " + data.lastname
                    })
                } else {
                    if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/profile/' + data.picture))) {
                        return res.json({
                            picture: "/themes/img/profile/" + data.picture,
                            fullname: data.firstname + " " + data.lastname
                        })
                    } else {
                        return res.json({
                            picture: "/themes/img/dashboard/Avatar.png",
                            fullname: data.firstname + " " + data.lastname
                        })
                    }

                }
            })
        }
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
router.get('/dashboard', checkAdmin, (req, res) => {
    try {
        User.findOne({
            id: req.session.iduser
        }).then((data) => {
            var myapps = [];
            async function getmyapp() {
                var today = moment().startOf('day')
                var tomorrow = moment(today).add(1, 'days')
                try {
                    for (let i = 0; i < data.myapp.length; i++) {
                        await TrafficModel.find({
                            idApp: data.myapp[i].idApp,
                        }).then((result) => {
                            if (result == []) {
                                var userOnline = [];
                                var appToday = [];
                                var useIos = [];
                                var useAndroid = [];
                                myapps[i] = {
                                    idApp: data.myapp[i].idApp,
                                    nameApp: data.myapp[i].nameApp,
                                    userOnline: userOnline.length,
                                    useToday: appToday.length,
                                    useIos: useIos.length,
                                    useAndroid: useAndroid.length
                                }
                            } else {
                                var userOnline = result.filter(function (el) {
                                    return new Date() - el.dateAccess <= 900000 &&
                                        new Date() - el.dateAccess >= 0
                                })
                                var appToday = result.filter(function (el) {
                                    return el.dateAccess - today >= 0 &&
                                        el.dateAccess - today <= 86400000
                                })
                                var useIos = result.filter(function (el) {
                                    return el.platform == "ios" &&
                                        el.dateAccess - today >= 0 &&
                                        el.dateAccess - today <= 86400000
                                });
                                var useAndroid = result.filter(function (el) {
                                    return el.platform == "android" &&
                                        el.dateAccess - today >= 0 &&
                                        el.dateAccess - today <= 86400000
                                });
                                // console.log(useIos)
                                myapps[i] = {
                                    idApp: data.myapp[i].idApp,
                                    nameApp: data.myapp[i].nameApp,
                                    userOnline: userOnline.length,
                                    useToday: appToday.length,
                                    useIos: useIos.length,
                                    useAndroid: useAndroid.length
                                }
                            }
                            // console.log(result)

                        })
                        // }
                        // })
                    }
                } catch (error) {
                    res.redirect("/dashboard/404")
                }
                // console.log(myapps)
                return res.render("./dashboard/detail", {
                    title: "Dashboard",
                    myapps,
                    appuse: ""
                });
            }
            getmyapp();
        })

    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
// router.get('/dashboard/app', checkAdmin, (req, res) => {
//     if (req.session.iduser) {

//     }
// })

router.post("/getamountapp", (req, res) => {
    try {
        Inforapp.find({
            idUser: {
                $elemMatch: {
                    idUser: req.session.iduser
                }
            }
        }, (err, data) => {
            if (err) throw err;
            console.log("myapp:" + data.length)
            return res.json({
                amount: data.length
            });
        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

router.post("/deleteapp", (req, res) => {
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
            try {
                console.log(role)
                if (role.idUser[0].role == 1) {
                    User.update({
                        id: req.session.iduser,
                        status: true
                    }, {
                        "$pull": {
                            myapp: {
                                idApp: req.body.idApp,
                            }
                        }
                    }, {
                        safe: true
                    }).then(() => {
                        Inforapp.remove({
                            idApp: req.body.idApp
                        }).then(() => {
                            TrafficModel.remove({
                                idApp: req.body.idApp
                            }).then(() => {
                                return res.json({
                                    status: "1"
                                })
                            })
                        })
                    })
                } else {
                    return res.json({
                        status: "2",
                        message: "You can't remove app"
                    })
                }
            } catch (error) {
                console.log(error + "")
                res.render("error", {
                    title: "Error",
                    error: error + ""
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