var express = require('express');
var router = express.Router();
var Q = require('q'),
    taydoCommandUtils = require('../lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars'),
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    http = require('http'),
    request = require('request'),
    extract = require('extract-zip'),
    multipart = require('connect-multiparty');
var zipFolder = require('zip-folder');
var appRoot = require('app-root-path');
var multipartMiddleware = multipart();
var jsonfile = require('jsonfile');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();

let Customer = require('../models/customer');
let Infomation = require('../models/infomation');
var listBuilding = require('../models/listbuilding');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var hostServer = libSetting.hostServer;
var hostIOS = libSetting.hostIOS;
var sumBuild = libSetting.totalBuilding;

router.get('/build-ios-by-diawi', (req, res) => {
    res.render('build-ios-diawi', { title: 'build ios diawi' });
});

router.post('/build-ios-by-diawi', (req, res) => {
    try {
        console.log('intro');
        var iput = req.body;
        var iputFile = req.file;
        console.log('input: ' + JSON.stringify(iput));
        console.log('iputFile: ' + JSON.stringify(iputFile));
        // var file1 = req.files.Provisiondevice;
        // console.log(file1);
        res.json({ status: '1', content: 'success' });
    } catch (error) {
        console.log(error);
    }

});

module.exports = router;