var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var async = require('async');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
let Infomation = require('../models/infomation');
let Statistic = require('../models/statistic');
let User = require('../models/user');
var moment = require('moment');

/* GET home page. */
router.get('/', async function(req, res, next) {
    // var sDateNow = Date.now();
    // var strDate = sDateNow.toString();
    // // var dateN = new Date();
    // console.log(strDate);
    // console.log(sDateNow);
    // console.log(dateN - (1000 * 60 * 60 * 5));
    console.log('req.session.iduser: ' + req.session.iduser);
    try {
        // res.cookie('cokkieFileUploaded', arrFileUpload)
        // console.log('cokkieFileUploaded: ' + req.cokkieFileUploaded);
        // console.log(moment().format('YYYY/MM/DD HH:mm'));
        // req.cookies.cokkieFileUploaded.push({ name: 'modernshop5.zip', dateCreate: '2017-12-10 10:26', sizeFile: '153Mb', nameFolder: 'HY671hjgkkLd1GT67' });
        // console.log('cookie: ' + JSON.stringify(req.cookies.cokkieFileUploaded));
        // console.log('cookie age: ' + req.cookies.maxAge);
        // console.log('1: ' + (req.cookies.cokkieFileUploaded[0].name));1
        // console.log('2: ' + (req.cookies.cokkieFileUploaded[1].name));
        // console.log(req.session.cookie.expires, req.session.cookie.maxAge);
        // console.log('arrCookie: ' + JSON.stringify(req.cookies));
        // console.log('arrFileUpload: ' + JSON.stringify(req.cookies.arrFileUpload));
        // var arrCk = req.cookies.arrFileUpload;
        // var itemFileUpload = { name: 'modernshop1.zip', dateCreate: '2017-12-09 10:50', sizeFile: '150Mb', nameFolder: '1231hjgkkLd160GGG' };
        // arrCk.push(itemFileUpload);
        // set_cookies.push(getCookie('arrFileUpload', itemFileUpload));
        // console.log('arrFileUpload: ' + JSON.stringify(req.cookies.arrFileUpload));
        var arrFilesUploaded = '';
        var arrItem = [];
        console.log('arrFileUploaded: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
        if (req.cookies.arrFileUploadedDeployapp) {
            async.each(req.cookies.arrFileUploadedDeployapp, function(dataItem) {
                console.log(dataItem);
                console.log(dataItem.keyFolder);
                if (fs.existsSync(path.join(appRoot, 'public', 'temporary', dataItem.keyFolder))) {
                    arrItem.push(dataItem);
                }

            });
            arrFilesUploaded = arrItem;
            // arrFilesUploaded = req.cookies.arrFileUploadedDeployapp;
            // arrFiles.forEach(function(item) {
            //     console.log('item: ' + item.fileName);
            // })
        }
        let realUploaded = await Infomation.find({}).count().exec();
        let realBuilded = await Infomation.find({ stepBuild: 'builded' }).count().exec();
        let realRegister = await User.find().count().exec();
        var sUploaded, sDeployed, sRegister;
        let staticUpload = await Statistic.find().exec();
        // console.log(staticUpload);

        await staticUpload.forEach(function(kq) {
            sUploaded = kq.uploaded;
            sDeployed = kq.deployed;
            sRegister = kq.register;
        });

        // sUploaded = sUploaded + 1;
        // sDeployed = sDeployed + 1;
        // sRegister = sRegister + 1;

        // let udStatistic = await Statistic.update({}, { $set: { uploaded: sUploaded, deployed: sDeployed, register: sRegister } }, { upsert: false }).exec();
        // console.log(udStatistic);
        sUploaded = (sUploaded + realUploaded).toLocaleString();
        sDeployed = (sDeployed + realBuilded).toLocaleString();
        sRegister = (sRegister + realRegister).toLocaleString();
        //  sUploaded = sUploaded.toLocaleString();

        // console.log('s: ' + sUploaded);

    } catch (error) {
        console.log(error);
    }

    console.log('checkBanneriOS: ' + req.session.checkBanneriOS);
    if (!req.session.checkBanneriOS) {
        req.session.checkBanneriOS = 1;
        console.log('0: ' + req.session.checkBanneriOS);
        res.render('index', { sUploaded, sDeployed, sRegister, title: 'Mobile App Builder For iOS and Android', banneriOS: 0, arrFilesUploaded: arrFilesUploaded });
    } else {
        console.log('1: ' + req.session.checkBanneriOS);
        res.render('index', { sUploaded, sDeployed, sRegister, title: 'Mobile App Builder For iOS and Android', banneriOS: 1, arrFilesUploaded: arrFilesUploaded });
    }
});
router.get('/index', async function(req, res, next) {
    try {
        var arrFilesUploaded = '';
        console.log('arrFileUploaded: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
        if (req.cookies.arrFileUploadedDeployapp) {
            arrFilesUploaded = req.cookies.arrFileUploadedDeployapp;
            // arrFiles.forEach(function(item) {
            //     console.log('item: ' + item.fileName);
            // })
        }
        var sUploaded, sDeployed, sRegister;
        let realUploaded = await Infomation.find({ stepBuild: 'uploaded' }).count().exec();
        let realBuilded = await Infomation.find({ stepBuild: 'builded' }).count().exec();
        let realRegister = await User.find().count().exec();

        let staticUpload = await Statistic.find().exec();
        // console.log(staticUpload);

        await staticUpload.forEach(function(kq) {
            sUploaded = kq.uploaded;
            sDeployed = kq.deployed;
            sRegister = kq.register;
        });

        // sUploaded = sUploaded + 1;
        // sDeployed = sDeployed + 1;
        // sRegister = sRegister + 1;

        // let udStatistic = await Statistic.update({}, { $set: { uploaded: sUploaded, deployed: sDeployed, register: sRegister } }, { upsert: false }).exec();
        // console.log(udStatistic);
        sUploaded = (sUploaded + realUploaded).toLocaleString();
        sDeployed = (sDeployed + realBuilded).toLocaleString();
        sRegister = (sRegister + realRegister).toLocaleString();
        //  sUploaded = sUploaded.toLocaleString();

        console.log('s: ' + sUploaded);
        console.log('checkBanneriOS: ' + req.session.checkBanneriOS);
        if (!req.session.checkBanneriOS) {
            req.session.checkBanneriOS = 1;
            console.log('0: ' + req.session.checkBanneriOS);
            res.render('index', { sUploaded, sDeployed, sRegister, title: 'Mobile App Builder For iOS and Android', banneriOS: 0, arrFilesUploaded: arrFilesUploaded });
        } else {
            console.log('1: ' + req.session.checkBanneriOS);
            res.render('index', { sUploaded, sDeployed, sRegister, title: 'Mobile App Builder For iOS and Android', banneriOS: 1, arrFilesUploaded: arrFilesUploaded });
        }
    } catch (error) {
        console.log(error);
    }


});


module.exports = router;