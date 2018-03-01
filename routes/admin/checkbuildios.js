var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Infomation = require('../../models/infomation');
var User = require('../../models/user');
var async = require('async');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var moment = require('moment');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;

router.get('/check-build-ios', async function(req, res) {
    let delFolderApp = () => {
        try {
            var sDateNow = Date.now();
            var sKey;
            Infomation.find({ dateCreate: { $lt: sDateNow - (1000 * 60 * 60 * 72) } }).exec(async(err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('error', { error: err, title: 'Error Data' });
                }

                if (result.length > 0) {
                    async.each(result, function(kq) {
                        // var mang = kq.keyFolder;
                        sKey = kq.keyFolder;
                        if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sKey))) {
                            fse.remove(path.join(appRoot, 'public', 'temporary', sKey), err => {
                                if (err) console.log(err);
                            })
                        }
                        if (fs.existsSync(path.join(appRoot, 'public', 'uploads', sKey + '.zip'))) {
                            fse.remove(path.join(appRoot, 'public', 'uploads', sKey + '.zip'), err => {
                                if (err) console.log(err);
                            })
                        }
                        if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey + '.zip'))) {
                            fse.remove(path.join(appRoot, 'public', 'projectios', sKey + '.zip'), err => {
                                if (err) console.log(err);
                            })
                        }
                        if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey))) {
                            fse.remove(path.join(appRoot, 'public', 'projectios', sKey), err => {
                                if (err) console.log(err);
                            })
                        }
                        if (fs.existsSync(path.join(appRoot, 'public', 'project', sKey))) {
                            fse.remove(path.join(appRoot, 'public', 'project', sKey), err => {
                                if (err) console.log(err);
                            })
                        }
                    })
                }
            });
        } catch (error) {
            console.log('Error delete file periodic: ' + error);
        }
    }

    try {
        var totalInfoIos,
            pageSize = 20,
            pageCount,
            infoIosList = [],
            infoIosArray = [],
            currentPage = 1;
        // var sDeployed, sUploaded, sRegister;
        // let sUploaded = await Infomation.find({ iosStatus: false }).count().exec();
        // let sDeployed = await Infomation.find({ stepBuild: 'builded' }).count().exec();
        // let sRegister = await User.find().count().exec();

        let projectsiOS = await Infomation.find({ $and: [{ platforms: 'ios', stepBuild: 'builded' }] }).sort({ dateCreate: 1 }).exec();
        console.log(projectsiOS);
        totalInfoIos = projectsiOS.length;
        console.log('length: ' + totalInfoIos);
        if (typeof req.query.page !== 'undefined') {
            currentPage = +req.query.page;
        }
        while (projectsiOS.length > 0) {
            infoIosArray.push(projectsiOS.splice(0, pageSize));
        }
        pageCount = Math.ceil(totalInfoIos / pageSize).toFixed();
        infoIosList = infoIosArray[+currentPage - 1];
        console.log('page count: ' + pageCount);
        // delFolderApp();
        res.render('admin/check-build-ios', {
            projectsiOS,
            infoIosList,
            totalInfoIos,
            pageCount,
            pageSize,
            currentPage,
            title: 'Track Admin',
            moment: moment
        });

    } catch (error) {
        res.render('error', { error, title: 'Error Data' });
    }

});
module.exports = router;