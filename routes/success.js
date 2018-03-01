var express = require('express');
var path = require('path');
var router = express.Router();
var async = require('async');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var QRCode = require('qrcode');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var multipart = require('connect-multiparty');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var multipartMiddleware = multipart();
let Infomation = require('../models/infomation');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var hostServer = libSetting.hostServer;
// router.post('/',)
/* GET home page. */
router.post('/success-mail', multipartMiddleware, async function(req, res) {
    try {
        req.check('email', 'email is required').notEmpty();
        req.check('cKeyFolder', 'cKeyFolder is required').notEmpty();
        var errors = req.validationErrors();
        //req.getValidationResult();
        // err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }
        var email = req.body.email;
        var sKeyFolder = req.body.cKeyFolder;

        console.log(email);
        console.log(sKeyFolder);

        var linkAppDebug, linkAppSigned, sAppName, sDate, cParams;
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        console.log('info: ' + result);
        console.log('info 2: ' + JSON.stringify(result));
        console.log('info lenght: ' + result.length);
        if (result.length > 0) {
            async.each(result, function(kq) {
                // var mang = kq.keyFolder;
                linkAppDebug = kq.linkDebug;
                console.log('link debug app:' + linkAppDebug);
                linkAppSigned = kq.linkSigned;
                console.log('link signed app:' + linkAppSigned);
                sAppName = kq.appName;
                console.log('app Name:' + sAppName);
                // sStepBuild = kq.stepBuild;
                sDate = moment(kq.dateCreate).format('YYYY-MM-DD hh:mm:ss');
                cParams = kq.isParams;
                aStep = kq.stepBuild;
                console.log('date: ' + sDate);
            });

        } else {
            console.log('404');
            // return res.
            if (devMode == true)
                return res.json({ status: "3", content: 'Database can not find key.' });
            else
                return res.json({ status: "3", content: 'Oops, something went wrong' });
        }


        let sendLinkMail = (emailReceive, linkAppDebug, linkAppSigned, App, dateApp) => {
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
                    from: 'Deploy App <no-reply@taydotech.com>',
                    to: emailReceive,
                    subject: 'Notification from DeployApp: ' + App + ' is now ready for download',
                    template: 'mail',
                    context: {
                        App,
                        linkAppDebug,
                        linkAppSigned,
                        sDate
                    }
                }
                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('info mail: ' + info);
                    console.log('info mail 2: ' + JSON.stringify(info));
                    return resolve('Message sent: ' + info.response);

                });
            });
        }
        let updateDB = (Condition, listArgv) => {
            return new Promise((resolve, reject) => {
                try {
                    // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                    Infomation.findOneAndUpdate(Condition, { $set: listArgv }, { upsert: false }, function(err, result) {
                        if (err) {
                            return reject(err);
                        }
                        return resolve('Update db success');
                    });
                } catch (error) {
                    return reject(error);
                }
            })
        }
        console.log('---Start Send mail----');
        return sendLinkMail(email, linkAppDebug, linkAppSigned, sAppName, sDate).then(function() {
            console.log('---Start Update DB Mail----');
            var cond = { keyFolder: sKeyFolder };
            var value = { email: email, stepBuild: 'sendMail' };
            return updateDB(cond, value);
        }).then(function() {
            console.log('---End Send Mail----');
            return res.json({ status: "1", content: 'Send mail success.' });
        }).catch((ex) => {
            console.log('lỗi: total' + ex + '');
            if (devMode == true)
                return res.json({ status: "3", content: ex + '' });
            else
                return res.json({ status: "3", content: 'Oops, something went wrong' });

        })

    } catch (error) {
        if (devMode == true)
            return res.json({ status: "3", content: error + '' });
        else
            return res.json({ status: "3", content: 'Oops, something went wrong' });

    }
});
// router.post('/success-mail', multipartMiddleware, async function(req, res) {
//     try {
//         var email = req.body.email;
//         var sKeyFolder = req.body.cKeyFolder;
//         console.log(email);
//         console.log(sKeyFolder);

//         var linkAppDebug, linkAppSigned, sAppName, sDate, cParams;
//         let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
//         console.log('info: ' + result);
//         console.log('info 2: ' + JSON.stringify(result));
//         console.log('info lenght: ' + result.length);
//         if (result.length > 0) {
//             async.each(result, function(kq) {
//                 // var mang = kq.keyFolder;
//                 linkAppDebug = kq.linkDebug;
//                 console.log('link debug app:' + linkAppDebug);
//                 linkAppSigned = kq.linkSigned;
//                 console.log('link signed app:' + linkAppSigned);
//                 sAppName = kq.appName;
//                 console.log('app Name:' + sAppName);
//                 // sStepBuild = kq.stepBuild;
//                 sDate = moment(kq.dateCreate).format('YYYY-MM-DD hh:mm:ss');
//                 cParams = kq.isParams;
//                 aStep = kq.stepBuild;
//                 console.log('date: ' + sDate);
//             });

//         } else {
//             console.log('404');
//             // return res.
//             if (devMode == true)
//                 res.json({ status: "3", content: 'Database can not find key.' });
//             else
//                 return res.json({ status: "3", content: 'Oops, something went wrong' });
//         }


//         let sendLinkMail = (emailReceive, linkAppDebug, linkAppSigned, App, dateApp) => {
//             return new Promise((resolve, reject) => {
//                 var transporter = nodemailer.createTransport({ // config mail server
//                     host: 'smtp.gmail.com',
//                     // port:'465',
//                     auth: {
//                         user: 'no-reply@taydotech.com',
//                         pass: 'taydotech!@#deployapp'
//                     }
//                 });
//                 transporter.use('compile', hbs({
//                     viewPath: path.join(appRoot, 'views'),
//                     extName: '.ejs'
//                 }));

//                 var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
//                     from: 'TayDoTech Team',
//                     to: emailReceive,
//                     subject: 'Notification from DeployApp,' + App + ' is now ready for download',
//                     template: 'mail',
//                     context: {
//                         App,
//                         linkAppDebug,
//                         linkAppSigned,
//                         sDate
//                     }
//                 }
//                 transporter.sendMail(mainOptions, function(err, info) {
//                     if (err) {
//                         return reject(err);
//                     }
//                     console.log('info mail: ' + info);
//                     console.log('info mail 2: ' + JSON.stringify(info));
//                     resolve('Message sent: ' + info.response);

//                 });
//             });
//         }
//         let updateDB = (Condition, listArgv) => {
//             return new Promise((resolve, reject) => {
//                 try {
//                     // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
//                     Infomation.findOneAndUpdate(Condition, { $set: listArgv }, { upsert: false }, function(err, result) {
//                         if (err) {
//                             reject(err);
//                         }
//                         resolve('Update db success');
//                     });
//                 } catch (error) {
//                     reject(error);
//                 }
//             })
//         }
//         return sendLinkMail(email, linkAppDebug, linkAppSigned, sAppName, sDate).then(function() {
//             var cond = { keyFolder: sKeyFolder };
//             var value = { email: email, stepBuild: 'sendmail' };
//             return updateDB(cond, value);
//         }).then(function() {
//             return res.json({ status: "1", content: 'Send mail success.' });
//         }).catch((ex) => {
//             console.log('lỗi: total' + ex + '');
//             if (devMode == true)
//                 return res.json({ status: "3", content: ex + '' });
//             else
//                 return res.json({ status: "3", content: 'Oops, something went wrong' });

//         })

//     } catch (error) {
//         if (devMode == true)
//             return res.json({ status: "3", content: error + '' });
//         else
//             return res.json({ status: "3", content: 'Oops, something went wrong' });
//     }
// });

router.get('/success/:keyId', async function(req, res, next) {

    let qrCode = (linkUnsign, linkSigned) => {
        return new Promise((resolve, reject) => {
            var opts = {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                rendererOpts: {
                    quality: 0.5
                }
            }
            console.log('debug qr: ' + linkUnsign);
            console.log('unsign qr: ' + linkSigned);
            QRCode.toDataURL(linkUnsign, function(err, urlUnsign) {
                if (err) {
                    console.log('error qr 1');
                    reject(err);
                }
                qrCodeUnsign = urlUnsign;
                console.log('Created unSign...');
                QRCode.toDataURL(linkSigned, function(err, urlSigned) {
                    if (err) {
                        console.log('error qr 2');
                        reject(err);
                    }
                    qrCodeSigned = urlSigned;
                    console.log('Created Signed...');
                    resolve('Generate qrcode success.');
                })
            })
        });
    }
    try {
        var sKeyFolder = req.params.keyId;
        console.log(sKeyFolder);
        var linkAppDebug, linkAppSigned, linkAppKeyStore, linkAppKeyStoretxt, qrCodeUnsign, qrCodeSign, sAppName, sStepBuild, cParams, sPlatform;
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        console.log('info: ' + result);
        console.log('info 2: ' + JSON.stringify(result));
        console.log('info lenght: ' + result.length);
        if (result.length > 0) {

            async.each(result, function(kq) {
                // var mang = kq.keyFolder;
                linkAppDebug = kq.linkDebug;
                console.log('link debug app:' + linkAppDebug);
                linkAppSigned = kq.linkSigned;
                console.log('link signed app:' + linkAppSigned);
                sAppName = kq.appName;
                console.log('app Name:' + sAppName);
                aStep = kq.stepBuild;
                console.log('stepbuild:' + aStep);
                cParams = kq.isParams;
                sPlatform = kq.platforms;
                console.log('sPlatform:' + sPlatform);
                linkAppKeyStore = kq.linkKeyStore;
                linkAppKeyStoretxt = kq.linkKeyStoretxt;
            });

            if (aStep == 'uploaded' && cParams == true) {
                // return res.render('info-app', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/setting-app/' + sKeyFolder);
            } else if (aStep == 'uploaded' && cParams == false) {
                // return res.render('platform', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/platforms/' + sKeyFolder);
            } else if (aStep == 'installed') {
                return res.redirect('/platforms/' + sKeyFolder);
            } else if (aStep == 'addedPlatform') {
                // res.render('info-build', { sKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/build-android/' + sKeyFolder);
            } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'android') {
                // if (!fs.existsSync(path.join(appRoot, 'public', 'backupapk', sKeyFolder))) {
                //     return res.render('not-folder-app', { title: 'App Not Found' });
                // }
                try {
                    var hostName = req.headers.host;
                    await qrCode(linkAppDebug, linkAppSigned);
                    var linkDisplayDebug = hostServer + '/' + sAppName + '.apk';
                    var linkDisplaySigned = hostServer + '/' + sAppName + '.apk';
                    if (!linkAppKeyStore) {
                        linkAppKeyStore = hostServer + '/download-keystore/' + sKeyFolder
                    }
                    res.render('success', { sKeyFolder, qrCodeUnsign, qrCodeSigned, sAppName, linkAppDebug, linkAppSigned, linkDisplayDebug, linkDisplaySigned, linkAppKeyStore, linkAppKeyStoretxt, title: 'Mobile App Builder For iOS and Android Step 5' });
                } catch (error) {
                    console.log('errors: ' + error);
                    return res.render('error', { error, title: 'Error page' });
                }
                // return res.render('success');
            } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'ios') {
                return res.redirect('/success-ios/' + sKeyFolder);
                // return res.render('success');
            } else {
                return res.render('404', { title: 'Page Not Found' });
            }
        } else {
            console.log('404');
            // return res.
            return res.render('404', { title: 'Page Not Found' });
        }
    } catch (error) {
        console.log('er: ' + error);
        return res.render('error', { error, title: 'Error page' });
    }

    // if (sess.qrcodeUnsign && sess.qrcodeSigned) {
    //     var qrUnsign = sess.qrcodeUnsign;
    //     var qrSigned = sess.qrcodeSigned;

    //     console.log('1');
    //     // / { qrUnsign: qrUnsign, qrSigned: qrSigned }
    //     res.render('success', { title: 'Mobile App Builder For iOS and Android' });
    // } else {
    //     console.log('2');
    //     res.render('index', { title: 'Mobile App Builder For iOS and Android' });
    // }
});
router.get('/success-ios/:keyId', async function(req, res, next) {


    try {
        var sKeyFolder = req.params.keyId;
        console.log(sKeyFolder);
        var linkAppDebug, linkAppSigned, qrCodeUnsign, qrCodeSign, sAppName, sEmail, sStepBuild, cParams, sPlatform;
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        console.log('info: ' + result);
        console.log('info 2: ' + JSON.stringify(result));
        console.log('info lenght: ' + result.length);
        if (result.length > 0) {

            async.each(result, function(kq) {
                // var mang = kq.keyFolder;
                linkAppDebug = kq.linkDebug;
                console.log('link debug app:' + linkAppDebug);
                linkAppSigned = kq.linkSigned;
                console.log('link signed app:' + linkAppSigned);
                sAppName = kq.appName;
                console.log('app Name:' + sAppName);
                aStep = kq.stepBuild;
                console.log('stepbuild:' + aStep);
                cParams = kq.isParams;
                sPlatform = kq.platforms;
                console.log('sPlatform:' + sPlatform);
                sEmail = kq.email;
                console.log('sEmail:' + sEmail);
            });

            if (aStep == 'uploaded' && cParams == true) {
                // return res.render('info-app', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/setting-app/' + sKeyFolder);
            } else if (aStep == 'uploaded' && cParams == false) {
                // return res.render('platform', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/platforms/' + sKeyFolder);
            } else if (aStep == 'installed') {
                return res.redirect('/platforms/' + sKeyFolder);
            } else if (aStep == 'addedPlatform' && sPlatform == 'android') {
                // res.render('info-build', { sKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                return res.redirect('/build-android/' + sKeyFolder);
            } else if (aStep == 'addedPlatform' && sPlatform == 'ios') {
                return res.redirect('/build-ios/' + sKeyFolder);
            } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'android') {
                try {
                    // if (!fs.existsSync(path.join(appRoot, 'public', 'project', sKeyFolder))) {
                    //     return res.render('not-folder-app', { title: 'App Not Found' });
                    // }
                    var hostName = req.headers.host;
                    await qrCode(linkAppDebug, linkAppSigned);
                    var linkDisplayDebug = 'http://' + hostName + '/' + sAppName + '-debug';
                    var linkDisplaySigned = 'http://' + hostName + '/' + sAppName;
                    return res.render('success', { sKeyFolder, qrCodeUnsign, qrCodeSigned, sAppName, linkAppDebug, linkAppSigned, linkDisplayDebug, linkDisplaySigned, title: 'Mobile App Builder For iOS and Android Step 5' });
                } catch (error) {
                    console.log('errors: ' + error);
                    return res.render('error', { error, title: 'Error page' });
                }
                // return res.render('success');
            } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'ios') {
                return res.render('success-ios', { sKeyFolder, sEmail, title: 'Mobile App Builder For iOS and Android Step 5' });
            } else {
                return res.render('404', { title: 'Page Not Found' });
            }
        } else {
            console.log('404');
            // return res.
            return res.render('404', { title: 'Page Not Found' });
        }
    } catch (error) {
        console.log('er: ' + error);
        return res.render('error', { error, title: 'Error page' });
    }

    // if (sess.qrcodeUnsign && sess.qrcodeSigned) {
    //     var qrUnsign = sess.qrcodeUnsign;
    //     var qrSigned = sess.qrcodeSigned;

    //     console.log('1');
    //     // / { qrUnsign: qrUnsign, qrSigned: qrSigned }
    //     res.render('success', { title: 'Mobile App Builder For iOS and Android' });
    // } else {
    //     console.log('2');
    //     res.render('index', { title: 'Mobile App Builder For iOS and Android' });
    // }
});
module.exports = router;