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
var fs = require('fs');

router.get("/dashboard/404", (req, res) => {
    res.render("404", {
        title: "404 not found"
    })
})

module.exports = router;