var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');
var Appversion = require('../../../models/appversionadmin');
var fs = require('fs');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}
router.get("/appsetting", (req, res) => {
    res.render("./dashboard/appsetting/appsetting", {
        title: "App Setting",
        appuse: ""
    })
})

module.exports = router;