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
var Appversion = require('../../../models/appversionadmin');
var fs = require('fs');
var Inforapp = require('../../../models/inforapp');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/appversion/:idapp', checkAdmin, (req, res) => {
    try {
        Inforapp.findOne({
            idApp: req.params.idapp,
            "idUser.idUser": req.session.iduser
        }).then((data) => {
            if (data) {
                Appversion.findOne({
                    idApp: req.params.idapp
                }, (err, count) => {
                    if (err) throw err;
                    // console.log(count)
                    try {
                        var appuse = {
                            idApp: req.params.idapp,
                            nameApp: count.nameApp
                        }
                    } catch (error) {
                        console.log(error)
                        res.render("error", {
                            title: "Error",
                            error
                        })
                    }
                    res.render('./dashboard/appversion/appversion', {
                        title: "App Version",
                        appversions: count,
                        appuse: appuse
                    })
                });
            } else {
                res.redirect("/dashboard/404")
            }
        })
        // console.log(req.params.idapp)
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

module.exports = router;