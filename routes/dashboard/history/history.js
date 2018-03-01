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
var User = require('../../../models/user');
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../../models/country');
var hostServer = libSetting.hostServer;
var Appversionuser = require('../../../models/appversionuser');
var appversion = require('../../../models/appversionadmin');
var Inforapp = require('../../../models/inforapp');
var fs = require('fs');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.get('/history/:idapp', checkAdmin, (req, res) => {
    try {
        Inforapp.findOne({
            idApp: req.params.idapp,
            "idUser.idUser": req.session.iduser
        }).then((data) => {
            console.log(data)
            if (data) {
                Appversionuser.find({
                    idApp: req.params.idapp,
                }, (err, count) => {
                    console.log(count)
                    var dateversion = [];
                    var appuse = {};
                    if (err) throw err;
                    async function renderhistory() {
                        for (let i = 0; i < count.length; i++) {
                            var getdatauser = await appversion.findOne({
                                idApp: count[i].idApp,
                                "inforAppversion.version": count[i].versionAdmin,
                                // status: true
                            }).exec()
                            console.log(getdatauser)
                            if (getdatauser != null) {
                                console.log("avx")
                                dateversion[i] = count[i];
                                appuse = {
                                    idApp: req.params.idapp,
                                    nameApp: getdatauser.nameApp
                                }
                            }
                            // console.log(getdatauser)
                        }
                        // console.log(dateversion)
                        res.render('./dashboard/history/history', {
                            title: "History",
                            history: dateversion,
                            appuse: appuse
                        })
                    }
                    renderhistory();
                });
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
router.post("/getnotehistory", (req, res) => {
    try {
        Appversionuser.updateOne({
            idApp: req.body.idApp,
            version: req.body.version
        }, {
            '$set': {
                note: req.body.note
            }
        }).then(() => {
            // console.log("abc")
            return res.json({
                status: "1",
                message: req.body.idApp
            })
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