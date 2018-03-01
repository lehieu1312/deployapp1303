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
    spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync,
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    http = require('http'),
    https = require('https'),
    plist = require('plist'),
    request = require('request'),
    extract = require('extract-zip'),
    multipart = require('connect-multiparty');
var zipFolder = require('zip-folder');

var multipartMiddleware = multipart();
var jsonfile = require('jsonfile');
var moment = require('moment');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multer = require('multer');
// var timeout = require('connect-timeout');
let Customer = require('../models/customer');
let Infomation = require('../models/infomation');
var listBuilding = require('../models/listbuilding');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var hostServer = libSetting.hostServer;
var hostIOS = libSetting.hostIOS;
var sumBuild = libSetting.totalBuilding;




router.get('/ios-views', (req, res) => {
    res.render('build-ios', { title: 'test views buid ios' });
});

router.get('/build-ios/:key', function(req, res) {
    try {
        console.log('devMode: ' + libSetting.devMode);
        console.log('devMode 2: ' + devMode);
        var sKeyFolder = req.params.key;

        var linkAppDebug, linkAppSigned, qrCodeUnsign, qrCodeSign, sAppName, sStepBuild, cParams, sPlatform;
        console.log('skey folder: ' + sKeyFolder);


        Infomation.find({ keyFolder: sKeyFolder }).exec((err, result) => {
                if (err) {
                    console.log(err);
                    return res.render('error', { error: err, title: 'Error Data' });
                }
                console.log('res: ' + result);
                console.log('res lenght: ' + result.length);
                // console.log('params: ' + result.isParams);
                if (result.length < 1) {
                    res.render('404', { title: 'Page Not Found' });
                } else {

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
                        if (sPlatform == 'android')
                            return res.redirect('/build-android/' + sKeyFolder);
                        // res.render('build-android', { sKeyFolder, title: 'Mobile App Builder For iOS and Android Step 4' });
                        else {
                            if (!fs.existsSync(path.join(appRoot, 'public', 'project', sKeyFolder))) {
                                return res.render('not-folder-app', { title: 'App Not Found' });
                            }
                            res.render('build-ios', { sKeyFolder, title: 'Mobile App Builder For iOS and Android Step 4' });
                        }


                        // return res.redirect('/infobuild/' + fKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'android') {
                        return res.redirect('/success/' + sKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'ios') {
                        return res.render('success-ios', { sKeyFolder, title: 'Mobile App Builder For iOS and Android Step 5' });
                    } else {
                        return res.render('404', { title: 'Page Not Found' });
                    }

                }
                // console.log('params end');
            })
            // res.render('index', { title: 'Mobile App Builder For iOS and Android' });
    } catch (error) {
        console.log('Get info build: ' + error);
        res.render('error', { error, title: 'Error Data' });
    }

    // res.render('info-build');
});



router.post('/save-info-ios', multipartMiddleware, function(req, res) {


    let uploadDiawi = (cmd, optionList) => {
        return new Promise((resolve, reject) => {
            try {
                var commandLine = crossSpawn.spawn(cmd, optionList);
                commandLine.stdout.on('data', function(data) {
                    console.log('data out: ' + data.toString());
                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        return reject(data);
                    }
                    resolve(data);
                });
                commandLine.stderr.on('data', function(data) {
                    console.log('data error: ' + data.toString());
                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                    if (data.toString().toLowerCase().indexOf('error') >= 0) {
                        // console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                });
                commandLine.on('close', function(code) {
                    if (code > 0) {
                        reject(new Error(code));
                    }
                    // resolve(code);
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    let getLinkDiawi = (cmd, optionList) => {
        return new Promise((resolve, reject) => {
            try {
                var commandLine = crossSpawn.spawn(cmd, optionList);
                commandLine.stdout.on('data', function(data) {
                    console.log('data out: ' + data.toString());
                    var kq = JSON.parse(data.toString())
                    console.log(kq.status);

                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                    if (kq.status == '2000') {
                        console.log('dk...');
                        return resolve(data);
                    }

                });
                commandLine.stderr.on('data', function(data) {
                    console.log('data error: ' + data.toString());
                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                    if (data.toString().toLowerCase().indexOf('error') >= 0) {
                        // console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                });
                commandLine.on('close', function(code) {
                    if (code > 0) {
                        reject(new Error(code));
                    }
                    // resolve(code);
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    let updateLinkInstalliOS = (fKeyFolder) => {
        return new Promise((resolve, reject) => {
            try {
                var linkInstalliOS = hostServer + '/install-ios-app/' + fKeyFolder;
                // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                Infomation.findOneAndUpdate({ keyFolder: fKeyFolder }, { $set: { linkInstalliOS: linkInstalliOS, stepBuild: 'builded' } }, function(err, result) {
                    if (err) {
                        console.log('Error Update DB: ' + err + '');
                        reject(err + '');
                    }
                    resolve(linkInstalliOS);
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    let generatePlistFile = (fKeyFolder, fLinkDebug, fAppName, fBundleID, fVersionApp) => {
        return new Promise((resolve, reject) => {
            try {
                // var pathKeyFolderPlist = path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist');
                console.log('start gen...');
                // console.log(path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist'));
                var pathPlistFileXample = path.join(appRoot, 'public', 'appxample', 'manifest-example.plist');
                if (!fs.existsSync(path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist'))) {
                    fse.copySync(pathPlistFileXample, path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist'));
                    // console.log('1');
                }
                fs.readFile(path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist'), function(err, data) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    var result = data.toString().replace('LINK_IPA', fLinkDebug);
                    result = result.toString().replace('PACKAGE_ID', fBundleID);
                    result = result.toString().replace('VERSION_NUMBER', fVersionApp);
                    result = result.toString().replace('APP_NAME', fAppName);
                    fse.writeFile(path.join(appRoot, 'public', 'backupipa', fKeyFolder, 'manifest.plist'), result, function(error) {
                        if (error) {
                            console.log(error);
                            reject(error);
                        }
                        resolve('Generate plist file  success');
                    });

                });

            } catch (error) {
                console.log(error);
                reject(error);
            }

        })

    }
    let getInfoToSendMail = (fKeyFolder) => {
        return new Promise((resolve, reject) => {
            try {
                // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                var linkAppDebug, linkAppSigned, sAppName, sVersionApp, sBundleID, sEmail, sCaseFileBuildiOS;
                Infomation.find({ keyFolder: fKeyFolder }).exec((err, result) => {
                    if (err) {
                        console.log(err);
                        return reject(err + '');
                        // return res.render('error', { error: err, title: 'Error Data' });
                    }
                    console.log('res: ' + result);
                    console.log('res lenght: ' + result.length);
                    // console.log('params: ' + result.isParams);
                    if (result.length < 1) {
                        return reject('Not Find Data');
                    } else {

                        async.each(result, function(kq) {
                            // var mang = kq.keyFolder;
                            linkAppDebug = kq.linkDebug;
                            console.log('link debug app:' + linkAppDebug);
                            linkAppSigned = kq.linkSigned;
                            console.log('link signed app:' + linkAppSigned);
                            sAppName = kq.appName;
                            console.log('app Name:' + sAppName);
                            sVersionApp = kq.versionApp;
                            console.log('sVersionApp:' + sVersionApp);
                            sBundleID = kq.bundleID;
                            console.log('sBundleID:' + sBundleID);
                            sEmail = kq.email;
                            console.log('sEmail:' + sEmail);
                            sCaseFileBuildiOS = kq.caseFileBuildiOS;
                            console.log('sCaseFileBuildiOS:' + sCaseFileBuildiOS);

                        });
                        var result = { linkDebug: linkAppDebug, linkSigned: linkAppSigned, appName: sAppName, bundleID: sBundleID, versionApp: sVersionApp, email: sEmail, caseFileBuildiOS: sCaseFileBuildiOS };
                        resolve(result);
                    }
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    let sendLinkMail = (emailReceive, linkAppUnsigned, linkAppSigned, App, sDate, fCaseFileiOS) => {
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
                var mainOptions;
                console.log(typeof fCaseFileiOS);
                console.log(fCaseFileiOS);
                if (fCaseFileiOS == 1) {
                    console.log('loai 1');
                    mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'Deploy App <no-reply@taydotech.com>',
                        to: emailReceive,
                        subject: 'Notification from DeployApp: ' + App + ' is now ready for download',
                        template: 'mail-ios-adhoc',
                        context: {
                            App,
                            linkAppUnsigned,
                            linkAppSigned,
                            sDate,
                            fCaseFileiOS
                        }
                    }
                } else if (fCaseFileiOS == 2) {
                    console.log('loai 2');
                    mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'Deploy App <no-reply@taydotech.com>',
                        to: emailReceive,
                        subject: 'Notification from DeployApp: ' + App + ' is now ready for download',
                        template: 'mail-ios-appstore',
                        context: {
                            App,
                            linkAppUnsigned,
                            linkAppSigned,
                            sDate,
                            fCaseFileiOS
                        }
                    }
                } else {
                    console.log('loai 3');
                    mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'Deploy App <no-reply@taydotech.com>',
                        to: emailReceive,
                        subject: 'Notification from DeployApp: ' + App + ' is now ready for download',
                        template: 'mail-ios',
                        context: {
                            App,
                            linkAppUnsigned,
                            linkAppSigned,
                            sDate,
                            fCaseFileiOS
                        }
                    }
                }

                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('info mail: ' + info);
                    console.log('info mail 2: ' + JSON.stringify(info));
                    resolve('Message sent: ' + info.response);

                });
            });
        }
        // console.log(req.body);
    try {
        var sKeyFolder, sEmail;
        var sTypeApp, sPathRootApp, sAppName, cLinkFileZip;
        var caseAdHoc = false,
            caseAppStore = false,
            caseAll = false;
        var caseFileiOS;
        var provisionAdHocExtFile, cerExtFileAdHoc, provisionAppStoreExtFile, cerExtFileAppStore;
        console.log('body: ' + JSON.stringify(req.body));
        console.log('files: ' + JSON.stringify(req.files));
        var provisionAdHocFile = req.files.provisionfile_adhoc;
        var provisionAppStoreFile = req.files.provisionfile_appstore;
        var certificateFileAppStore = req.files.certificatefile_appstore;
        var certificateFileAdHoc = req.files.certificatefile_adhoc;
        var provisionAdHocName, provisionAppStoreName, certificateAdHocName, certificateAppStoreName;
        // console.log(provisionAdHocFile);
        // console.log(provisionAdHocFile);
        sEmail = req.body.email;
        sKeyFolder = req.body.cKeyFolder;

        console.log(provisionAdHocFile);
        console.log(provisionAppStoreFile);
        console.log(certificateFileAppStore);
        console.log(certificateFileAdHoc);
        console.log(sEmail);
        console.log(sKeyFolder);

        req.check('cKeyFolder', 'Key Folder is required').notEmpty();
        req.check('email', 'Email is required').notEmpty();
        req.check('email', 'Enter valid email').isEmail();
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }
        if (typeof provisionAdHocFile != 'undefined' && typeof certificateFileAdHoc != 'undefined' &&
            (typeof provisionAppStoreFile == 'undefined' || typeof certificateFileAppStore == 'undefined')) {
            provisionAdHocExtFile = provisionAdHocFile.name.split('.').pop();
            cerExtFileAdHoc = certificateFileAdHoc.name.split('.').pop();
            provisionAdHocName = provisionAdHocFile.name;
            certificateAdHocName = certificateFileAdHoc.name;
            provisionAppStoreName = '';
            certificateAppStoreName = '';
            if (provisionAdHocExtFile != 'mobileprovision') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.mobileprovision)' });
            } else if (cerExtFileAdHoc != 'p12') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.p12)' });
            } else if (provisionAdHocFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAdHocFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAdHoc.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAdHoc.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else {
                caseAdHoc = true;
            }

        } else if (typeof provisionAppStoreFile != 'undefined' && typeof certificateFileAppStore != 'undefined' &&
            (typeof provisionAdHocFile == 'undefined' || typeof certificateFileAdHoc == 'undefined')) {

            provisionAppStoreExtFile = provisionAppStoreFile.name.split('.').pop();
            cerExtFileAppStore = certificateFileAppStore.name.split('.').pop();
            provisionAdHocName = '';
            certificateAdHocName = '';
            provisionAppStoreName = provisionAppStoreFile.name;
            certificateAppStoreName = certificateFileAppStore.name;
            if (provisionAppStoreExtFile != 'mobileprovision') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.mobileprovision)' });
            } else if (cerExtFileAppStore != 'p12') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.p12)' });
            } else if (provisionAppStoreFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAppStoreFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAppStore.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAppStore.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else {
                caseAppStore = true;
            }
        } else if (typeof provisionAdHocFile != 'undefined' && typeof certificateFileAdHoc != 'undefined' &&
            typeof provisionAppStoreFile != 'undefined' && typeof certificateFileAppStore != 'undefined') {
            caseAll = true;
            provisionAdHocExtFile = provisionAdHocFile.name.split('.').pop();
            cerExtFileAdHoc = certificateFileAdHoc.name.split('.').pop();
            provisionAppStoreExtFile = provisionAppStoreFile.name.split('.').pop();
            cerExtFileAppStore = certificateFileAppStore.name.split('.').pop();
            provisionAdHocName = provisionAdHocFile.name;
            certificateAdHocName = certificateFileAdHoc.name;
            provisionAppStoreName = provisionAppStoreFile.name;
            certificateAppStoreName = certificateFileAppStore.name;
            if (provisionAdHocExtFile != 'mobileprovision' || provisionAppStoreExtFile != 'mobileprovision') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.mobileprovision)' });
            } else if (cerExtFileAdHoc != 'p12' || cerExtFileAppStore != 'p12') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.p12)' });
            } else if (provisionAdHocFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAdHocFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAdHoc.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAdHoc.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (provisionAppStoreFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAppStoreFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAppStore.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAppStore.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else {
                caseAll = true;
            }
        } else {
            return res.json({ status: "2", content: 'You must upload all files in "App to the Testing" section Or You must upload all files in "App to the App Store" section Or all file' });
        }


        if (!fs.existsSync(path.join(appRoot, 'public', 'project', sKeyFolder, 'inputprovision'))) {
            fs.mkdirSync(path.join(appRoot, 'public', 'project', sKeyFolder, 'inputprovision'));
        }
        var pathProvision = path.join(appRoot, 'public', 'project', sKeyFolder, 'inputprovision');
        console.log(pathProvision);
        console.log(caseAdHoc);
        console.log(caseAppStore);
        console.log(caseAll);
        if (caseAdHoc == true) {
            var dataAdHoc = fs.readFileSync(provisionAdHocFile.path);
            fs.writeFileSync(path.join(pathProvision, provisionAdHocFile.name), dataAdHoc);

            var dataCertificateAdHoc = fs.readFileSync(certificateFileAdHoc.path);
            fs.writeFileSync(path.join(pathProvision, certificateFileAdHoc.name), dataCertificateAdHoc);
            caseFileiOS = 1;
        } else if (caseAppStore == true) {
            var dataAppStore = fs.readFileSync(provisionAppStoreFile.path);
            fs.writeFileSync(path.join(pathProvision, provisionAppStoreFile.name), dataAppStore);

            var dataCertificateAppStore = fs.readFileSync(certificateFileAppStore.path);
            fs.writeFileSync(path.join(pathProvision, certificateFileAppStore.name), dataCertificateAppStore);
            caseFileiOS = 2;
        } else if (caseAll == true) {
            var dataAdHoc = fs.readFileSync(provisionAdHocFile.path);
            fs.writeFileSync(path.join(pathProvision, provisionAdHocFile.name), dataAdHoc);

            var dataCertificateAdHoc = fs.readFileSync(certificateFileAdHoc.path);
            fs.writeFileSync(path.join(pathProvision, certificateFileAdHoc.name), dataCertificateAdHoc);
            var dataAppStore = fs.readFileSync(provisionAppStoreFile.path);
            fs.writeFileSync(path.join(pathProvision, provisionAppStoreFile.name), dataAppStore);

            var dataCertificateAppStore = fs.readFileSync(certificateFileAppStore.path);
            fs.writeFileSync(path.join(pathProvision, certificateFileAppStore.name), dataCertificateAppStore);
            caseFileiOS = 3;
        } else {
            console.log('File upload empty end...');
            return res.json({ status: "2", content: ' File upload is not empty.You have to choose one of the two tasks or both to upload' });
        }




        if (fs.existsSync(path.join(appRoot, 'public', 'project', sKeyFolder, 'platforms'))) {
            fse.removeSync(path.join(appRoot, 'public', 'project', sKeyFolder, 'platforms'));
        }




        // console.log('Zip folder...');
        zipFolder(path.join(appRoot, 'public', 'project', sKeyFolder), path.join(appRoot, 'public', 'project', sKeyFolder + '.zip'), function(err) {
            if (err) {
                console.log('oh no!', err);
                if (devMode) {
                    return res.json({ status: "3", content: err + '' });
                } else {
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
            }
            console.log('Zip Success...');
            var hostName = req.headers.host;
            cLinkFileZip = hostServer + '/' + 'getfile-zip/' + sKeyFolder;
            // provisionAdHocName
            // certificateAdHocName
            // provisionAppStoreName
            // certificateAppStoreName
            Infomation.findOneAndUpdate({ keyFolder: sKeyFolder }, { $set: { email: sEmail, provisionFileAdHoc: provisionAdHocName, provisionFileAppStore: provisionAppStoreName, certificateFileAdHoc: certificateAdHocName, certificateFileAppStore: certificateAppStoreName, iosStatus: false, linkFileZip: cLinkFileZip, caseFileBuildiOS: caseFileiOS } }, function(er, result) {
                if (er) {
                    console.log('oh no!', er);
                    if (devMode) {
                        return res.json({ status: "3", content: er + '' });
                    } else {
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                }

                request.post(hostIOS + '/build-ios-macsv', { json: { keyFolder: sKeyFolder } }, async(err, respone, body) => {
                    if (err) {
                        console.log(err);
                        if (devMode) {
                            return res.json({ status: "3", content: err + '' });
                        } else {
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                        }
                    }
                    console.log('respone: ' + JSON.stringify(respone));
                    console.log('body: ' + JSON.stringify(body));
                    console.log('body content: ' + body.content);
                    if (body.status == '1') {
                        var linkFileZipIPA, sAppName, sBundleId, sVersionApp;
                        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
                        if (result.length > 0) {
                            async.each(result, function(kq) {
                                linkFileZipIPA = kq.linkZipIPA;
                                console.log(linkFileZipIPA);
                                sAppName = kq.appName;
                                // sBundleId = kq.bundleID;
                                // sVersionApp = kq.versionApp;
                            });
                        }
                        var linkPipe = path.join(appRoot, 'public', 'backupipa', sKeyFolder + '.zip');
                        var file = fs.createWriteStream(linkPipe);
                        var request = http.get(linkFileZipIPA, function(response) {
                            response.pipe(file);
                            file.on('finish', function() {
                                file.close();
                                console.log('success get file');
                                // extract(pathFileZip, { dir: path.join(appRoot, 'public', 'projectios', fKeyFolder) }, function(err) {
                                if (fs.existsSync(path.join(appRoot, 'public', 'backupipa', sKeyFolder))) {
                                    fse.removeSync(path.join(appRoot, 'public', 'backupipa', sKeyFolder));
                                }
                                extract(linkPipe, { dir: path.join(appRoot, 'public', 'backupipa', sKeyFolder) }, function(err) {
                                    if (err) {
                                        console.log('Extract fail: ' + err);
                                        if (devMode == true)
                                            return res.json({ status: "3", content: "Error extract file: " + err + '' });
                                        else
                                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                                    } else {


                                        var tLinkDebug, tLinksigned, tAppName, tVersionApp, tBundleID, tEmail, tDate, mCaseFileiOS;
                                        console.log('===gEt info to send mail ===');
                                        return getInfoToSendMail(sKeyFolder).then((result) => {
                                                console.log('=====Gennerate  Plist File======');
                                                console.log(result);
                                                tLinkDebug = result.linkDebug;
                                                console.log(tLinkDebug);
                                                tLinksigned = result.linkSigned;
                                                console.log(tLinksigned);
                                                tAppName = result.appName;
                                                console.log(tAppName);
                                                tVersionApp = result.versionApp;
                                                console.log(tVersionApp);
                                                tBundleID = result.bundleID;
                                                console.log(tBundleID);
                                                tEmail = result.email;
                                                console.log(tEmail);
                                                mCaseFileiOS = result.caseFileBuildiOS;
                                                console.log(mCaseFileiOS);
                                                // sDate = moment(kq.dateCreate).format('YYYY-MM-DD hh:mm:ss');
                                                tDate = moment(result.dateCreate).format('YYYY-MM-DD hh:mm:ss');
                                                console.log('tDate: ' + tDate);
                                                return generatePlistFile(sKeyFolder, tLinkDebug, tAppName, tBundleID, tVersionApp);
                                                // return sendLinkMail(sEmail, debug, signed, appName);
                                            }).then(() => {
                                                console.log('=====Update DB link install=====');
                                                return updateLinkInstalliOS(sKeyFolder);
                                            }).then((result) => {
                                                console.log('===Start Send Mail====');
                                                return sendLinkMail(tEmail, result, tLinksigned, tAppName, tDate, mCaseFileiOS);
                                            }).then(() => {
                                                console.log('====Build Success====');
                                                console.log('key: ' + sKeyFolder);
                                                return res.json({ status: '1', keyFolder: sKeyFolder, content: 'Build Success.' });
                                            }).catch((ex) => {
                                                console.log(ex);
                                                if (devMode) {
                                                    return res.json({ status: "3", content: ex + '' });
                                                } else {
                                                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                                                }
                                            })
                                            ///
                                    }
                                })

                            });

                        }).on('error', function(err) { // Handle errors
                            fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
                            console.log('unlink: ' + err);
                            return res.json({ status: '3', content: 'Oops - something went wrong. We were unable to deploy this app at this time. Retry.' });
                        });
                        //  else {
                        //     return res.json({ status: '3', content: 'Not Find Project' });
                        // }
                    } else {
                        console.log(body.content);
                        if (devMode == true)
                            return res.json({ status: "3", content: body.content });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                });
            });
        });
    } catch (error) {
        console.log(error);
        if (devMode) {
            return res.json({ status: "3", content: error + '' });
        } else {
            return res.json({ status: "3", content: 'Oops, something went wrong' });
        }


    }

});
router.post('/build-ios-macsv', async(req, res) => {
    try {
        // req.setTimeout(0);
        var sKeyFolder, sProvisionAdHocFileName, sProvisionAppStoreFileName, sCertificateAdHocFileName,
            sCertificateAppStoreFileName, sAppName, linkFileZip, sCaseFileiOs;
        var nameAdHoc, nameAppStore, nameCertificate, UUIDAdHoc, UUIDAppStore, TeamIDAdHoc, TeamIDAppStore, mailCustomer;
        sKeyFolder = req.body.keyFolder;
        console.log('vao roi');
        console.log(sKeyFolder);
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        if (result.length > 0) {
            async.each(result, function(kq) {
                sAppName = kq.appName;
                console.log(sAppName);
                linkFileZip = kq.linkFileZip;
                console.log('linkFileZip: ' + linkFileZip);
                mailCustomer = kq.email;
                console.log('mailCustomer: ' + mailCustomer);
                sProvisionAdHocFileName = kq.provisionFileAdHoc;
                console.log('sProvisionAdHocFileName: ' + sProvisionAdHocFileName);
                sProvisionAppStoreFileName = kq.provisionFileAppStore;
                console.log('sProvisionAppStoreFileName: ' + sProvisionAppStoreFileName);
                sCertificateAdHocFileName = kq.certificateFileAdHoc;
                console.log('sCertificateAdHocFileName: ' + sCertificateAdHocFileName);
                sCertificateAppStoreFileName = kq.certificateFileAppStore;
                console.log('sCertificateAppStoreFileName: ' + sCertificateAppStoreFileName);
                sCaseFileiOs = kq.caseFileBuildiOS;
                console.log('sCaseFileiOs: ' + sCaseFileiOs);
            });
        } else {
            return res.json({ status: '3', content: 'Not Find Project' });
        }
        ///LIST FUNCTION PROCESSING/////
        let getFileZipProject = (fileZip, fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('1');
                    if (fs.exists(path.join(appRoot, 'public', 'projectios', fKeyFolder + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder + '.zip'));
                    }
                    console.log(fileZip);
                    var linkPipe = path.join(appRoot, 'public', 'projectios', fKeyFolder + '.zip');
                    var file = fs.createWriteStream(linkPipe);
                    var request = https.get(fileZip, function(response) {
                        response.pipe(file);
                        file.on('finish', function() {
                            file.close();
                            console.log('success get file');
                            resolve(linkPipe);
                        });

                    }).on('error', function(err) { // Handle errors
                        fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
                        console.log('unlink: ' + err);
                        reject(err);
                    });

                } catch (error) {
                    console.log('error get file: ' + error);
                    reject(error);
                }
            })
        }

        let extractFile = (pathFileZip, fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('start extract');
                    console.log('pathFileZip: ' + pathFileZip);
                    console.log(path.join(appRoot, 'public', 'projectios', fKeyFolder));
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fKeyFolder))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder));
                    }
                    extract(pathFileZip, { dir: path.join(appRoot, 'public', 'projectios', fKeyFolder) }, function(err) {
                        // extraction is complete. make sure to handle the err 
                        if (err) {
                            console.log('Extract fail: ' + err);
                            reject(err);
                        } else {
                            console.log('success');
                            resolve('success');
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }
        let readPlistFileAdHoc = (plistFile) => {
            return new Promise((resolve, reject) => {
                try {
                    var obj = plist.parse(fs.readFileSync(plistFile, "utf8"));
                    // console.log(JSON.stringify(obj));
                    console.log(obj.UUID);
                    console.log(obj.TeamIdentifier[0]);
                    UUIDAdHoc = obj.UUID;
                    TeamIDAdHoc = obj.TeamIdentifier[0];
                    resolve({ teamID: TeamIDAdHoc, UUID: UUIDAdHoc });
                } catch (error) {
                    console.log(error);
                    reject(error + '');
                }
            })
        }

        let buildiOSToTest = (fKeyFolder, fProvisionFileAdHoc, fCertificateFileAdHoc, fAppName) => {
            return new Promise((resolve, reject) => {

                    console.log('===============Security import certificate===============');
                    var cmd = 'security';
                    var argv = ['import', fCertificateFileAdHoc, '-P', ''];
                    // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                    process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                    return commandLine(cmd, argv).then(() => {
                            console.log('===============Open Provision Ad-Hoc ===============');
                            console.log(fProvisionFileAdHoc);
                            console.log(fKeyFolder);
                            // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName)
                            var pathFileProvision = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', fProvisionFileAdHoc);
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                            return commandLine('open', [pathFileProvision]);
                        })
                        .then(() => {
                            console.log('======Generate Plist File Ad-Hoc=========');
                            nameProvisionAdHoc = fProvisionFileAdHoc.split('.').shift();
                            console.log('nameProvisionAdHoc: ' + nameProvisionAdHoc);
                            //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                            return commandLine('security', ['cms', '-D', '-i', fProvisionFileAdHoc, '-o', nameProvisionAdHoc + '.plist']);
                        }).then(() => {
                            console.log('====== Read File Plist Ad-Hoc =========');
                            console.log('nameProvisionAdHoc 2: ' + nameProvisionAdHoc);
                            var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', nameProvisionAdHoc + '.plist');
                            return readPlistFileAdHoc(pathPlistAdHoc);
                        }).then((result) => {
                            console.log('======Generate Build JSON File=========');
                            console.log(result);
                            return generatesBuildJSONAdHoc(result.UUID, result.teamID, fKeyFolder);
                        }).then(() => {
                            console.log('=========Building IPA to Test==========');
                            var cmd = 'ionic';
                            var argvBuild = ['cordova', 'build', 'ios', '--device', '--release', '--buildConfig'];
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder));
                            return commandLine(cmd, argvBuild);
                        }).then(() => {
                            console.log('=========Copy File IPA to Test==========');
                            var pathDirIPA = path.join(appRoot, 'public', 'projectios', fKeyFolder);
                            var pathCopyIPA = path.join(appRoot, 'public', 'backupipa');
                            return copyFileIPATest(pathDirIPA, pathCopyIPA, fKeyFolder, fAppName);
                        }).then(() => {
                            console.log('log: Generate File Build Ad-Hoc Success...');
                            return resolve('Generate File Build Ad-Hoc Success...');
                        })
                        .catch((ex) => {
                            console.log(ex);
                            reject(ex);
                        })
                        // console.log('================ Create File plist adHoc============');
                        // // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                        // nameAdHoc = adHocFileName.split('.').shift();
                        // console.log('nameAdHoc: ' + nameAdHoc);
                        // //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                        // process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                        // return commandLine('security', ['cms', '-D', '-i', adHocFileName, '-o', nameAdHoc + '.plist'])
                        //     .then(() => {
                        //         var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', nameAdHoc + '.plist')
                        //         return readPlistFileAdHoc(pathPlistAdHoc);
                        //     }).then(() => {
                        //         return generatesBuildJSONAdHoc(UUIDAdHoc, TeamIDAdHoc, fKeyFolder);
                        //     }).then(() => {
                        //         console.log('log: Generate File Build Ad-Hoc Success...');
                        //         return resolve('Generate File Build Ad-Hoc Success...');
                        //     }).catch((er) => {
                        //         console.log(er);
                        //         reject(er);
                        //     })
                })
                // .catch((ex) => {
                //     console.log('ex: ' + ex);
                //     reject(ex);
                // })
        }
        let buildiOSToAppStore = (fKeyFolder, fProvisionFileAppStore, fCertificateFileAppStore, fAppName) => {
            return new Promise((resolve, reject) => {
                    console.log('===============Security import certificate===============');
                    var cmd = 'security';
                    var argv = ['import', fCertificateFileAppStore, '-P', ''];
                    // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                    process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                    return commandLine(cmd, argv).then(() => {
                            console.log('===============Open Provision App-Store ===============');
                            console.log(fProvisionFileAppStore);
                            console.log(fKeyFolder);
                            // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName)
                            var pathFileProvision = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', fProvisionFileAppStore);
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                            return commandLine('open', [pathFileProvision]);
                        }).then(() => {
                            console.log('======Generate Plist File App-Store=========');
                            nameProvisionAppStore = fProvisionFileAppStore.split('.').shift();
                            console.log('nameProvisionAppStore: ' + nameProvisionAppStore);
                            //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                            return commandLine('security', ['cms', '-D', '-i', fProvisionFileAppStore, '-o', nameProvisionAppStore + '.plist']);
                        }).then(() => {
                            console.log('====== Read File Plist App-Store =========');
                            console.log('nameProvisionAppStore 2: ' + nameProvisionAppStore);
                            process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                            var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', nameProvisionAppStore + '.plist');
                            return readPlistFileAppStore(pathPlistAdHoc);
                        }).then((result) => {
                            console.log('======Generate Build JSON File=========');
                            console.log(result);
                            process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                            return generatesBuildJSONAppStore(result.UUID, result.teamID, fKeyFolder);
                        }).then(() => {
                            console.log('=========Building IPA to App Store==========');
                            var cmd = 'ionic';
                            var argvBuild = ['cordova', 'build', 'ios', '--device', '--release', '--buildConfig'];
                            process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder));
                            return commandLine(cmd, argvBuild);
                        }).then(() => {
                            console.log('=========Copy File IPA to App Store==========');
                            var pathDirIPA = path.join(appRoot, 'public', 'projectios', fKeyFolder);
                            var pathCopyIPA = path.join(appRoot, 'public', 'backupipa');
                            return copyFileIPAAppStore(pathDirIPA, pathCopyIPA, fKeyFolder, fAppName);
                        }).then(() => {
                            console.log('log: Generate File Build App Store Success...');
                            return resolve('Generate File Build App Store Success...');
                        })
                        .catch((ex) => {
                            console.log(ex);
                            reject(ex);
                        })
                        // console.log('================ Create File plist adHoc============');
                        // // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                        // nameAdHoc = adHocFileName.split('.').shift();
                        // console.log('nameAdHoc: ' + nameAdHoc);
                        // //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                        // process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                        // return commandLine('security', ['cms', '-D', '-i', adHocFileName, '-o', nameAdHoc + '.plist'])
                        //     .then(() => {
                        //         var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', nameAdHoc + '.plist')
                        //         return readPlistFileAdHoc(pathPlistAdHoc);
                        //     }).then(() => {
                        //         return generatesBuildJSONAdHoc(UUIDAdHoc, TeamIDAdHoc, fKeyFolder);
                        //     }).then(() => {
                        //         console.log('log: Generate File Build Ad-Hoc Success...');
                        //         return resolve('Generate File Build Ad-Hoc Success...');
                        //     }).catch((er) => {
                        //         console.log(er);
                        //         reject(er);
                        //     })
                })
                // .catch((ex) => {
                //     console.log('ex: ' + ex);
                //     reject(ex);
                // })
        }

        let generatesBuildJSONAdHoc = (fUUID, fTeamID, fKeyFolder) => {

            return new Promise((resolve, reject) => {
                try {
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'));
                    }
                    var content = {
                        "ios": {
                            "debug": {
                                "codeSignIdentity": "iPhone Development",
                                "provisioningProfile": fUUID,
                                "developmentTeam": fTeamID,
                                "packageType": "development"
                            },
                            "release": {
                                "codeSignIdentity": "iPhone Distribution",
                                "provisioningProfile": fUUID,
                                "developmentTeam": fTeamID,
                                "packageType": "ad-hoc"
                            }
                        }
                    };
                    jsonfile.writeFileSync(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'), content);
                    //  (err) => {
                    //     if (err) {
                    //         console.log(err + '');
                    //         reject(err);
                    //     } else 
                    resolve('generate build success.');
                    // });
                } catch (e) {
                    console.log("Cannot write file ", e + '');
                    reject(e);
                }
            })
        }


        let readPlistFileAppStore = (plistFile) => {
            return new Promise((resolve, reject) => {
                try {
                    var obj = plist.parse(fs.readFileSync(plistFile, "utf8"));
                    // console.log(JSON.stringify(obj));
                    console.log(obj.UUID);
                    console.log(obj.TeamIdentifier[0]);
                    UUIDAppStore = obj.UUID;
                    TeamIDAppStore = obj.TeamIdentifier[0];
                    resolve({ teamID: TeamIDAdHoc, UUID: UUIDAdHoc });
                } catch (error) {
                    console.log(error);
                    reject(error + '');
                }
            })
        }

        let getInfoAppStoreAndgenerateFileJSON = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                    console.log('================ Create File plist AppStore============');
                    // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                    nameAppStore = appStoreFileName.split('.').shift();
                    console.log('nameAppStore: ' + nameAppStore);
                    //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                    process.chdir(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision'));
                    return commandLine('security', ['cms', '-D', '-i', appStoreFileName, '-o', nameAppStore + '.plist']).then(() => {
                        var pathPlistAppStore = path.join(appRoot, 'public', 'projectios', fKeyFolder, 'inputprovision', nameAppStore + '.plist')
                        return readPlistFileAppStore(pathPlistAppStore);
                    }).then(() => {
                        return generatesBuildJSONAppStore(UUIDAppStore, TeamIDAppStore, fKeyFolder);
                    }).then(() => {
                        console.log('log: Generate File Build App-Store Success...');
                        return resolve('Generate File Build App-Store Success...');
                    }).catch((er) => {
                        console.log(er);
                        reject(er);
                    })
                })
                // .catch((ex) => {
                //     console.log('ex: ' + ex);
                //     reject(ex);
                // })
        }
        let generatesBuildJSONAppStore = (fUUID, fTeamID, fKeyFolder) => {

            return new Promise((resolve, reject) => {
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'));
                }
                var content = {
                    "ios": {
                        "debug": {
                            "codeSignIdentity": "iPhone Development",
                            "provisioningProfile": fUUID,
                            "developmentTeam": fTeamID,
                            "packageType": "development"
                        },
                        "release": {
                            "codeSignIdentity": "iPhone Distribution",
                            "provisioningProfile": fUUID,
                            "developmentTeam": fTeamID,
                            "packageType": "app-store"
                        }
                    }
                };

                try {
                    jsonfile.writeFile(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'), content, (err) => {
                        if (err) {
                            console.log(err + '');
                            reject(err);
                        } else resolve('generate build success.');
                    });
                } catch (e) {
                    console.log("Cannot write file ", e + '');
                    reject(e);
                }
            })
        }



        let sendLinkMail = (emailReceive, linkAppUnsign, linkAppSigned, App) => {
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
                    subject: 'Check file application',
                    template: 'mail',
                    context: {
                        App,
                        linkAppUnsign,
                        linkAppSigned
                    }
                }
                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('info mail: ' + info);
                    console.log('info mail 2: ' + JSON.stringify(info));
                    resolve('Message sent: ' + info.response);

                });
            });
        }
        let copyFileIpa = (pathProjectApp, fApp) => {
            return new Promise((resolve, reject) => {
                try {


                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
                    if (!fs.existsSync(path_signed)) {
                        fs.mkdirSync(path_signed);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fApp + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(path_signed, fApp + '.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file ipa unsign success.');
                    });
                } catch (error) {
                    reject(error);
                }
                // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.ipa'));
                // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', sess.appName + '.ipa'))
                //     .pipe(out);
                // out.on("end", resolve("copy success."));
                // out.on("error", reject(''));
            });
        }
        let copyFileApp = (pathProjectApp, fApp) => {
            return new Promise((resolve, reject) => {
                try {
                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_signed = path.join(pathProjectApp, 'outputs', 'unsigned');
                    if (!fs.existsSync(path_signed)) {
                        fs.mkdirSync(path_signed);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', fApp + '.app');
                    var wFile = path.join(path_signed, fApp + '-debug.app');
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file app unsign success.');
                    });
                } catch (error) {
                    reject(error);
                }
                // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.app'));
                // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', sess.appName + '.app'))
                //     .pipe(out);
                // out.on("end", resolve("copy success."));
                // out.on("error", reject(''));
            });
        }
        let commandLine = (cmd, optionList) => {
            return new Promise((resolve, reject) => {
                try {
                    var commandLine = crossSpawn.spawn(cmd, optionList);
                    commandLine.stdout.on('data', function(data) {
                        console.log('data out: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.stderr.on('data', function(data) {
                        console.log('data error: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                        if (data.toString().toLowerCase().indexOf('error') >= 0) {
                            // console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.on('close', function(code) {
                        if (code > 0) {
                            reject(new Error(code));
                        }
                        resolve('Success commandline.');
                    });
                } catch (error) {
                    reject(error);
                }
            })
        }


        let updateDB = (Condition, listArgv) => {
            return new Promise((resolve, reject) => {
                try {
                    // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                    Infomation.findOneAndUpdate({ keyFolder: Condition }, { $set: listArgv }, function(err, result) {
                        if (err) {
                            reject(err);
                        }
                        listBuilding.remove({ keyFolder: Condition }, function(err, kq) {
                            if (err) {
                                console.log('Error remove key building: ' + err);
                                reject(err);
                            }
                            resolve('Update db success.');
                        })
                    });
                } catch (error) {
                    reject(error);
                }
            })
        }
        let checkBuildingiOS = (totalBuild, fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    let listBuild = new listBuilding({
                        keyFolder: fKeyFolder,
                        platforms: 'ios',
                        dateStartBuild: Date.now()
                    });
                    listBuild.save((err, result) => {
                        if (err) {
                            console.log('err save list build: ' + err);
                            reject(err);
                        }
                        // resolve('Insert building success.');
                        listBuilding.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                            if (err) {
                                console.log('Error find building: ' + err);
                                reject(err);
                            }
                            async.each(result, function(key) {
                                console.log('Check key: ' + key.keyFolder);
                                if (fKeyFolder == key.keyFolder) {
                                    return resolve('Key success ');
                                }
                            });
                            var CheckKeyFolderInterval = setInterval(function() {
                                listBuilding.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                                    if (err) {
                                        console.log('Error find building: ' + err);
                                        reject(err);
                                    }
                                    async.each(result, function(key) {
                                        console.log('Check key interval: ' + key.keyFolder);
                                        if (fKeyFolder == key.keyFolder) {
                                            clearInterval(CheckKeyFolderInterval);
                                            return resolve('Key success');
                                        }
                                    });
                                });
                            }, 3000)
                        });
                    });
                } catch (error) {
                    console.log('Error total check build: ' + error);
                    reject(error);
                }
            })
        }
        let copyFileIPATest = (pathProjectApp, pathBackupIPA, fKeyFolder, fAppName) => {
            return new Promise((resolve, reject) => {
                try {
                    var pathFolder = path.join(pathBackupIPA, fKeyFolder);
                    if (!fs.existsSync(pathFolder)) {
                        fs.mkdirSync(pathFolder);
                    }
                    var pathUnsigned = path.join(pathBackupIPA, fKeyFolder, 'unsigned');
                    if (!fs.existsSync(pathUnsigned)) {
                        fs.mkdirSync(pathUnsigned);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fAppName + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(pathUnsigned, fAppName + '-test.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file apk unsign success.');
                    });
                    // const outAplication = fs.createWriteStream(path.join(path_signed, 'android-release-unsigned.apk'));
                    // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk'))
                    //     .pipe(outAplication);
                    // outAplication.on("end", resolve("copy success."));
                    // outAplication.on("error", reject('Error copy file apk.'));
                } catch (error) {
                    reject(error);
                }
            });
        }
        let copyFileIPAAppStore = (pathProjectApp, pathBackupIPA, fKeyFolder, fAppName) => {
            return new Promise((resolve, reject) => {
                try {
                    var pathFolder = path.join(pathBackupIPA, fKeyFolder);
                    if (!fs.existsSync(pathFolder)) {
                        fs.mkdirSync(pathFolder);
                    }
                    var pathSigned = path.join(pathBackupIPA, fKeyFolder, 'signed');
                    if (!fs.existsSync(pathSigned)) {
                        fs.mkdirSync(pathSigned);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fAppName + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(pathSigned, fAppName + '.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file apk unsign success.');
                    });
                    // const outAplication = fs.createWriteStream(path.join(path_signed, 'android-release-unsigned.apk'));
                    // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk'))
                    //     .pipe(outAplication);
                    // outAplication.on("end", resolve("copy success."));
                    // outAplication.on("error", reject('Error copy file apk.'));
                } catch (error) {
                    reject(error);
                }
            });
        }
        let zipIPAAndUpdate = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    zipFolder(path.join(appRoot, 'public', 'backupipa', fKeyFolder), path.join(appRoot, 'public', 'backupipa', fKeyFolder + '.zip'), function(err) {
                        if (err) {
                            console.log('oh no!', err);
                            reject(err);
                        }
                        var hostName = req.headers.host;
                        var cLinkZipIpa = hostIOS + '/' + 'send-zipipa/' + fKeyFolder;

                        Infomation.findOneAndUpdate({ keyFolder: fKeyFolder }, { $set: { linkZipIPA: cLinkZipIpa } }, function(err, result) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fKeyFolder))) {
                                fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder));
                            }
                            if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fKeyFolder + '.zip'))) {
                                fse.removeSync(path.join(appRoot, 'public', 'projectios', fKeyFolder + '.zip'));
                            }
                            resolve('Zip success.');
                        });
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }
        let requetsFile = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    request(hostServer + '/get-outputs/' + fKeyFolder, { json: true }, (err, res, body) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                        resolve(body);
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }


        console.log('======================= Check list building =======================');
        return checkBuildingiOS(sumBuild, sKeyFolder).then(() => {
                console.log('======================= Start get url =======================');
                return getFileZipProject(linkFileZip, sKeyFolder);
            }).then((result) => {
                console.log('================== Extract file =========================');
                return extractFile(result, sKeyFolder);
            })
            .then(() => {
                console.log('Access file...');
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine('chmod', ['-R', '777', './']);
            })
            .then(() => {
                console.log('==================NPM install package================');
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine('npm', ['install']);
            })
            .then(() => {
                console.log('=======ReBuild Node-Sass========');
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine('npm', ['rebuild', 'node-sass']);
            })
            .then(() => {
                //    console.log('kq: ' + result);
                console.log('=======Add Platform========');
                var cmdRelease = 'ionic';
                var argv;
                // console.log(sPlatform);
                argv = ['cordova', 'platform', 'add', 'ios'];
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine(cmdRelease, argv);
            }).then(() => {
                if (sCaseFileiOs == 1) {
                    console.log('=====Build test=====');
                    process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                    return buildiOSToTest(sKeyFolder, sProvisionAdHocFileName, sCertificateAdHocFileName, sAppName);
                } else if (sCaseFileiOs == 2) {
                    console.log('=====Start build ios app store=====');
                    process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                    return buildiOSToAppStore(sKeyFolder, sProvisionAppStoreFileName, sCertificateAppStoreFileName, sAppName);
                } else {
                    console.log('=====Build test=====');
                    process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                    return buildiOSToTest(sKeyFolder, sProvisionAdHocFileName, sCertificateAdHocFileName, sAppName)
                        .then(() => {
                            console.log('=====Start build ios app store=====');
                            process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                            return buildiOSToAppStore(sKeyFolder, sProvisionAppStoreFileName, sCertificateAppStoreFileName, sAppName);
                        })
                }
            })
            .then(() => {
                console.log('================== Update Database ===================');
                var hostName = req.headers.host;
                console.log('hostName:' + hostName);
                slinkDebug = path.join('static', 'debug', sKeyFolder, sAppName + '-test.ipa');
                slinkSigned = path.join('static', 'signed', sKeyFolder, sAppName + '.ipa');
                slinkDebug = slinkDebug.replace(/ /g, '%20');
                slinkDebug = slinkDebug.replace("\\", "/");

                slinkSigned = slinkSigned.replace(/ /g, '%20');
                slinkSigned = slinkSigned.replace("\\", "/");
                console.log(slinkDebug);
                console.log(slinkSigned);
                slinkDebug = hostServer + '/' + slinkDebug;
                slinkSigned = hostServer + '/' + slinkSigned;
                // slinkDebug = path.join(hostServer, slinkDebug);
                // slinkSigned = path.join(hostServer, slinkSigned);
                console.log(slinkDebug);
                console.log(slinkSigned);

                var cond = sKeyFolder;
                var value = { linkDebug: slinkDebug, linkSigned: slinkSigned, iosStatus: true };
                return updateDB(cond, value);
            }).then((kq) => {
                console.log(kq);
                console.log('================== Zip folder outputs ===================');
                return zipIPAAndUpdate(sKeyFolder);
            })
            .then(() => {
                console.log('================== Finish Process ===================');
                return res.json({ status: "1", content: 'success' });
            }).catch((ex) => {
                console.log('ex: ' + ex);
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKeyFolder))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                }
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKeyFolder + '.zip'))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', sKeyFolder + '.zip'));
                }
                listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
                    if (err) {
                        if (devMode == true)
                            return res.json({ status: "3", content: err + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: ex } }).exec((er, resUpdate) => {
                        if (er) {
                            console.log('lỗi: total' + er + '');
                            if (devMode == true)
                                return res.json({ status: "3", content: er + '' });
                            else
                                return res.json({ status: "3", content: 'Oops, something went wrong' });
                        }

                        if (devMode == true)
                            return res.json({ status: "3", content: ex + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    });

                });

            })

        // if (devMode == true) {
        //     return res.json({ status: "3", content: ex + '' });
        // } else {
        //     return res.json({ status: "3", content: 'Oops, something went wrong' });
        // }
        // .then(() => {
        //     console.log('===============Open Provision App Store ===============');
        //     var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', appStoreFileName)
        //     process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision'));
        //     return commandLine('open', [appStoreFileName]);
        // }).then(() => {
        //     console.log('================ Create File plist AppStore============');
        //     // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
        //     nameAppStore = appStoreFileName.split('.').shift();
        //     console.log('nameAppStore: ' + nameAppStore);
        //     //security cms -D -i sunbri.mobileprovision -o sunbri.plist
        //     process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision'));
        //     return commandLine('security', ['cms', '-D', '-i', appStoreFileName, '-o', nameAppStore + '.plist']);
        // }).then(() => {
        //     console.log('================ Read File plist App Store ============');
        //     var pathPlistAppStore = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', nameAppStore + '.plist');
        //     return readPlistFileAppStore(pathPlistAppStore);
        // }).then(() => {
        //     console.log('==============Generate Build JSON File App Store===============');
        //     return generatesBuildJSONAppStore(UUIDAppStore, TeamIDAppStore, sKeyFolder);
        // })
        // .then(() => {
        //     console.log('=========Building IPA to AppStore==========');
        //     var cmd = 'ionic';
        //     var argvBuild = ['build', 'ios', '--device', '--release', '--buildConfig'];
        //     process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
        //     return commandLine(cmd, argvBuild);
        // })
        // .then(() => {
        //     console.log('=========Copy File IPA to AppStore==========');
        //     return copyFileIPAAppStore(path.join(appRoot, 'public', 'projectios', sKeyFolder), path.join(appRoot, 'public', 'backupipa'), sKeyFolder, sAppName);
        // })
        // .then(() => {
        //         console.log('===============Security import certificate===============');
        //         var cmd = 'security';
        //         var argv = ['import', certificateFileName, '-P', ''];
        //         // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
        //         process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision'));
        //         return commandLine(cmd, argv);
        //     })
        //     .then(() => {
        //         console.log('===============Open Provision Ad-Hoc ===============');
        //         console.log(adHocFileName);
        //         // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName)
        //         var pathFileProvision = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName);
        //         process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision'));
        //         return commandLine('open', [pathFileProvision]);
        //     })
        //     .then(() => {
        //         console.log('======Generate Plist File Ad-Hoc=========');
        //         nameAdHoc = adHocFileName.split('.').shift();
        //         console.log('nameAdHoc: ' + nameAdHoc);
        //         //security cms -D -i sunbri.mobileprovision -o sunbri.plist
        //         process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision'));
        //         return commandLine('security', ['cms', '-D', '-i', adHocFileName, '-o', nameAdHoc + '.plist']);
        //     })
        //     .then(() => {
        //         console.log('====== Read File Plist Ad-Hoc =========');
        //         var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', nameAdHoc + '.plist');
        //         return readPlistFileAdHoc(pathPlistAdHoc);
        //     })
        //     .then(() => {
        //         console.log('======Generate Build JSON File=========');
        //         return generatesBuildJSONAdHoc(UUIDAdHoc, TeamIDAdHoc, sKeyFolder);
        //     })
        //     .then(() => {
        //         console.log('=========Building IPA to Test==========');
        //         var cmd = 'ionic';
        //         var argvBuild = ['build', 'ios', '--device', '--release', '--buildConfig'];
        //         process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
        //         return commandLine(cmd, argvBuild);
        //     })
        //     .then(() => {
        //         console.log('=========Copy File IPA to Test==========');
        //         return copyFileIPATest(path.join(appRoot, 'public', 'projectios', sKeyFolder), path.join(appRoot, 'public', 'backupipa'), sKeyFolder, sAppName);
        //     })


    } catch (error) {
        console.log(error);
        // return res.json({ status: "3", content: error });
        listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: error } }).exec((er, resUpdate) => {
                if (er) {
                    console.log('lỗi: total' + er + '');
                    if (devMode == true)
                        return res.json({ status: "3", content: er + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }

                if (devMode == true)
                    return res.json({ status: "3", content: error + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            });

        });
    }

});




///////////////////////////Build iOS Client/////////////////////////////////////////////////////
router.post('/build-ios-client', async function(req, res) {
    try {
        var sTypeApp, sPathRootApp, sAppName, teamID, uUID, sKeyFolder, linkFileZip, slinkDebug, slinkSigned, mailCustomer;
        req.check('cKeyFolder', 'KeyFolder is required').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }
        sKeyFolder = req.body.cKeyFolder;
        console.log('key: ' + sKeyFolder);

        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        if (result.length > 0) {
            async.each(result, function(kq) {
                teamID = kq.teamID;
                console.log('teamID: ' + teamID);
                sAppName = kq.appName;
                console.log(sAppName);
                uUID = kq.uUID;
                console.log(uUID);
                linkFileZip = kq.linkFileZip;
                console.log('linkFileZip: ' + linkFileZip);
                mailCustomer = kq.email;
                console.log('mailCustomer: ' + mailCustomer);

            });
        } else {
            return res.json({ status: '3', content: 'Not Find Project' });
        }


        let getFileZipProject = (fileZip, cKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('1');
                    if (fs.exists(path.join(appRoot, 'public', 'projectios', cKeyFolder + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', cKeyFolder + '.zip'));
                    }
                    var linkPipe = path.join(appRoot, 'public', 'projectios', cKeyFolder + '.zip');
                    var file = fs.createWriteStream(linkPipe);
                    var request = https.get(fileZip, function(response) {
                        response.pipe(file);
                        file.on('finish', function() {
                            file.close();
                            console.log('success get file');
                            resolve(linkPipe);
                        });

                    }).on('error', function(err) { // Handle errors
                        fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
                        console.log('unlink: ' + err);
                        reject(err);
                    });

                } catch (error) {
                    console.log('error get file: ' + error);
                    reject(error);
                }
            })
        }

        let extractFile = (pathFileZip, cKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('start extract');
                    console.log('pathFileZip: ' + pathFileZip);
                    console.log(path.join(appRoot, 'public', 'projectios', cKeyFolder));
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', cKeyFolder))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', cKeyFolder));
                    }
                    extract(pathFileZip, { dir: path.join(appRoot, 'public', 'projectios', cKeyFolder) }, function(err) {
                        // extraction is complete. make sure to handle the err 
                        if (err) {
                            console.log('Extract fail: ' + err);
                            reject(err);
                        } else {
                            console.log('success');
                            resolve('success');
                        }
                    })
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }
        let generatesBuildFile = (TeamID, UUID, fKeyFolder) => {
            return new Promise((resolve, reject) => {
                var content = {
                    "ios": {
                        "debug": {
                            "codeSignIdentity": "iPhone Development",
                            "provisioningProfile": UUID,
                            "developmentTeam": TeamID,
                            "packageType": "development"
                        },
                        "release": {
                            "codeSignIdentity": "iPhone Distribution",
                            "provisioningProfile": UUID,
                            "developmentTeam": TeamID,
                            "packageType": "app-store"
                        }
                    }
                };

                try {
                    jsonfile.writeFile(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'build.json'), content, (err) => {
                        if (err) reject(err);
                        else resolve('generate build success.');
                    });
                } catch (e) {
                    console.log("Cannot write file ", e);
                }
            })
        }
        let sendLinkMail = (emailReceive, linkAppUnsign, linkAppSigned, App) => {
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
                    subject: 'Check file application',
                    template: 'mail',
                    context: {
                        App,
                        linkAppUnsign,
                        linkAppSigned
                    }
                }
                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return reject(err);
                    }
                    console.log('info mail: ' + info);
                    console.log('info mail 2: ' + JSON.stringify(info));
                    resolve('Message sent: ' + info.response);

                });
            });
        }
        let copyFileIpa = (pathProjectApp, fApp) => {
            return new Promise((resolve, reject) => {
                try {


                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
                    if (!fs.existsSync(path_signed)) {
                        fs.mkdirSync(path_signed);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fApp + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(path_signed, fApp + '.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, err => {
                        if (err) return reject(err + '');
                        resolve('Copy file ipa unsign success.');
                    });
                } catch (error) {
                    reject(error);
                }
                // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.ipa'));
                // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', sess.appName + '.ipa'))
                //     .pipe(out);
                // out.on("end", resolve("copy success."));
                // out.on("error", reject(''));
            });
        }
        let copyFileApp = (pathProjectApp, fApp) => {
            return new Promise((resolve, reject) => {
                try {
                    var path_outputs = path.join(pathProjectApp, 'outputs');
                    if (!fs.existsSync(path_outputs)) {
                        fs.mkdirSync(path_outputs);
                    }
                    var path_signed = path.join(pathProjectApp, 'outputs', 'unsigned');
                    if (!fs.existsSync(path_signed)) {
                        fs.mkdirSync(path_signed);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', fApp + '.app');
                    var wFile = path.join(path_signed, fApp + '-debug.app');
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file app unsign success.');
                    });
                } catch (error) {
                    reject(error);
                }
                // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.app'));
                // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', sess.appName + '.app'))
                //     .pipe(out);
                // out.on("end", resolve("copy success."));
                // out.on("error", reject(''));
            });
        }
        let commandLine = (cmd, optionList) => {
            return new Promise((resolve, reject) => {
                try {
                    var commandLine = crossSpawn.spawn(cmd, optionList);
                    commandLine.stdout.on('data', function(data) {
                        console.log('data out: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.stderr.on('data', function(data) {
                        console.log('data error: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                        if (data.toString().toLowerCase().indexOf('error') >= 0) {
                            // console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.on('close', function(code) {
                        if (code > 0) {
                            reject(new Error(code));
                        }
                        resolve('Success commandline.');
                    });
                } catch (error) {
                    reject(error);
                }
            })
        }


        let updateDB = (Condition, listArgv) => {
            return new Promise((resolve, reject) => {
                try {
                    // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                    Infomation.findOneAndUpdate({ keyFolder: Condition }, { $set: listArgv }, function(err, result) {
                        if (err) {
                            reject(err);
                        }
                        listBuilding.remove({ keyFolder: Condition }, function(err, kq) {
                            if (err) {
                                console.log('Error remove key building: ' + err);
                                reject(err);
                            }
                            resolve('Update db success.');
                        })
                    });
                } catch (error) {
                    reject(error);
                }
            })
        }
        let checkBuildingiOS = (totalBuild, fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    let listBuild = new listBuilding({
                        keyFolder: fKeyFolder,
                        platforms: 'ios',
                        dateStartBuild: Date.now()
                    });
                    listBuild.save((err, result) => {
                        if (err) {
                            console.log('err save list build: ' + err);
                            reject(err);
                        }
                        // resolve('Insert building success.');
                        listBuilding.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                            if (err) {
                                console.log('Error find building: ' + err);
                                reject(err);
                            }
                            async.each(result, function(key) {
                                console.log('Check key: ' + key.keyFolder);
                                if (fKeyFolder == key.keyFolder) {
                                    return resolve('Key success ');
                                }
                            });
                            var CheckKeyFolderInterval = setInterval(function() {
                                listBuilding.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                                    if (err) {
                                        console.log('Error find building: ' + err);
                                        reject(err);
                                    }
                                    async.each(result, function(key) {
                                        console.log('Check key interval: ' + key.keyFolder);
                                        if (fKeyFolder == key.keyFolder) {
                                            clearInterval(CheckKeyFolderInterval);
                                            return resolve('Key success');
                                        }
                                    });
                                });
                            }, 3000)
                        });
                    });
                } catch (error) {
                    console.log('Error total check build: ' + error);
                    reject(error);
                }
            })
        }
        let zipOutPutsAndUpdate = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    zipFolder(path.join(appRoot, 'public', 'projectios', fKeyFolder, 'outputs'), path.join(appRoot, 'public', 'projectios', fKeyFolder, 'outputs.zip'), function(err) {
                        if (err) {
                            console.log('oh no!', err);
                            reject(err);
                        }
                        var hostName = req.headers.host;
                        var cLinkOutPuts = hostServer + '/' + 'send-outputs/' + fKeyFolder;

                        Infomation.findOneAndUpdate({ keyFolder: fKeyFolder }, { $set: { linkOutPuts: cLinkOutPuts } }, function(err, result) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            resolve('Zip success.');
                        });
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }
        let requetsFile = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    request(hostServer + '/get-outputs/' + fKeyFolder, { json: true }, (err, res, body) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        console.log(body.url);
                        console.log(body.explanation);
                        resolve(body);
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }

        // return res.json({ status: "1", content: 'success' });
        console.log('======================= Check list building =======================');
        return checkBuildingiOS(sumBuild, sKeyFolder).then(() => {
                console.log('======================= Start get url =======================');
                return getFileZipProject(linkFileZip, sKeyFolder);
            }).then((result) => {
                console.log('================== Extract file =========================');
                return extractFile(result, sKeyFolder);
            })
            .then(function() {
                console.log('NPM install package...');
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine('npm', ['i']);
            })
            .then(() => {
                console.log('=================== Build debug ==========================');
                var cmd = 'ionic';
                var argvBuild = ['cordova', 'build', 'ios', '--prod'];
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine(cmd, argvBuild);
            }).then(() => {
                console.log('=============== Copy file app unsign =======================');
                return copyFileApp(path.join(appRoot, 'public', 'projectios', sKeyFolder), sAppName);
            }).then(() => {
                console.log('=============== Generate File Build.json =======================');
                return generatesBuildFile(teamID, uUID, sKeyFolder);
            }).then(() => {
                console.log('=================== Build release ==========================');
                var cmd = 'ionic';
                var argvBuild = ['cordova', 'build', 'ios', '--device', '--release', '--prod', '--buildConfig'];
                process.chdir(path.join(appRoot, 'public', 'projectios', sKeyFolder));
                return commandLine(cmd, argvBuild)
            }).then(() => {
                console.log('================== Copy file app signed ===================');
                return copyFileIpa(path.join(appRoot, 'public', 'projectios', sKeyFolder), sAppName);
            }).then(() => {
                console.log('================== Update Database ===================');
                var hostName = req.headers.host;
                console.log('hostName:' + hostName);


                slinkDebug = path.join(hostServer, 'static', 'debug', sKeyFolder, sAppName + '.app');
                slinkSigned = path.join(hostServer, 'static', 'signed', sKeyFolder, sAppName + '.ipa');
                slinkDebug = slinkDebug.replace(/ /g, '%20');
                slinkDebug = slinkDebug.replace("\\", "/");

                slinkSigned = slinkSigned.replace(/ /g, '%20');
                slinkSigned = slinkSigned.replace("\\", "/");

                // slinkDebug = 'http://' + slinkDebug;
                // slinkSigned = 'http://' + slinkSigned;

                var cond = sKeyFolder;
                var value = { linkDebug: slinkDebug, linkSigned: slinkSigned, stepBuild: 'builded', iosStatus: true };
                return updateDB(cond, value);
            }).then(() => {
                console.log('================== Zip folder outputs ===================');
                return zipOutPutsAndUpdate(sKeyFolder);
            }).then(() => {
                console.log('================== Request Server ===================');
                return requetsFile(sKeyFolder);
            }).then(() => {
                console.log('================== Send Mail  ===================');
                return sendLinkMail(mailCustomer, slinkDebug, slinkSigned, sAppName);
            }).then((result) => {
                console.log('================== Finish Process ===================');
                return res.json({ status: "1", content: 'success' });
            }).catch((ex) => {
                console.log('ex: ' + ex);
                listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
                    if (err) {
                        if (devMode == true)
                            return res.json({ status: "3", content: err + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: ex } }).exec((er, resUpdate) => {
                        if (er) {
                            console.log('lỗi: total' + er + '');
                            if (devMode == true)
                                return res.json({ status: "3", content: er + '' });
                            else
                                return res.json({ status: "3", content: 'Oops, something went wrong' });
                        }

                        if (devMode == true)
                            return res.json({ status: "3", content: ex + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    });

                });

                // if (devMode == true) {
                //     return res.json({ status: "3", content: ex + '' });
                // } else {
                //     return res.json({ status: "3", content: 'Oops, something went wrong' });
                // }
            })

    } catch (error) {
        console.log(error);
        // return res.json({ status: "3", content: error });
        listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: error } }).exec((er, resUpdate) => {
                if (er) {
                    console.log('lỗi: total' + er + '');
                    if (devMode == true)
                        return res.json({ status: "3", content: er + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }

                if (devMode == true)
                    return res.json({ status: "3", content: error + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            });

        });
    }

});
///////////////////////////////////////////////////Build iOS/////////////////////////////////////////////////////////////////////
router.post('/build-ios', multipartMiddleware, async function(req, res) {
    var teamID, uUID, sKeyFolder;
    var sTypeApp, sPathRootApp, sAppName;
    req.check('teamID', 'TeamID is required').notEmpty();
    req.check('UUID', 'TeamID is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.json({ status: "2", content: errors });
    }
    try {
        teamID = req.body.teamID,
            uUID = req.body.UUID,
            sKeyFolder = req.body.cKeyFolder;
        console.log('teanID: ' + teamID);
        console.log('uUID: ' + uUID);
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();

        if (result.length > 0) {
            console.log('check async');
            async.each(result, function(kq) {
                // var mang = kq.keyFolder;
                sTypeApp = kq.typeApp;
                console.log('type app:' + sTypeApp);
                sPathRootApp = kq.pathRootFolder;
                console.log('root folder:' + sPathRootApp);
                sAppName = kq.appName;
                console.log('app name:' + sAppName);
            })
        } else {
            return res.render('404', { title: 'Page Not Found' });
        }
    } catch (error) {
        return res.json({ status: '3', content: error + '' });
    }
    //var sudochmod = crossSpawn.spawn('chmod +x hooks/after_prepare/010_add_platform_class.js');
    // sudochmod.stdout.on('data', function(data) {
    //     console.log('data out: ' + data.toString());
    // });

    // sudochmod.stderr.on('data', function(data) {
    //     if (data) {
    //         //console.log(chalk.bold(data.toString()));
    //         console.log('data error: ' + data.toString());
    //     }
    // });
    let generatesBuildFile = (TeamID, UUID, fKeyFolder) => {
        return new Promise((resolve, reject) => {
            var content = {
                "ios": {
                    "debug": {
                        "codeSignIdentity": "iPhone Development",
                        "provisioningProfile": UUID,
                        "developmentTeam": TeamID,
                        "packageType": "development"
                    },
                    "release": {
                        "codeSignIdentity": "iPhone Distribution",
                        "provisioningProfile": UUID,
                        "developmentTeam": TeamID,
                        "packageType": "app-store"
                    }
                }
            };

            try {
                jsonfile.writeFile(path.join(appRoot, 'public', 'project', fKeyFolder, 'build.json'), content, (err) => {
                    if (err) reject(err);
                    else resolve('generate build success.');
                });
            } catch (e) {
                console.log("Cannot write file ", e);
            }
        })
    }

    let unZip = (in_file, out_file) => {
        return new Promise((resolve, reject) => {
            extract(in_file, { dir: out_file }, function(err, data) {
                if (err) reject(err);
                else {
                    resolve('extract done...');
                }
            })
        })
    }
    let checkAppCordova = (pathProjectApp) => {
        return checkConfig = fs.existsSync(path.join(pathProjectApp, 'config.xml'))
            // return deferred.promise;
    }
    let joinProject = (pathProjectApp, pathProjectTemp) => {
        return new Promise((resolve, reject) => {
            try {

                fse.removeSync(path.join(pathProjectApp, 'www'));
                fse.removeSync(path.join(pathProjectApp, 'plugins'));
                fse.removeSync(path.join(pathProjectApp, 'resources'));
                fse.removeSync(path.join(pathProjectApp, 'config.xml'));
                fse.removeSync(path.join(pathProjectApp, 'platforms'));
                fse.moveSync(path.join(pathProjectTemp, 'www'), path.join(pathProjectApp, 'www'));
                fse.moveSync(path.join(pathProjectTemp, 'plugins'), path.join(pathProjectApp, 'plugins'));
                fse.moveSync(path.join(pathProjectTemp, 'resources'), path.join(pathProjectApp, 'resources'));
                fse.moveSync(path.join(pathProjectTemp, 'config.xml'), path.join(pathProjectApp, 'config.xml'));
                resolve('success.');

            } catch (error) {
                reject(error);
            }


        });
    }
    let copyFileIpa = (pathProjectApp, nApp) => {
        return new Promise((resolve, reject) => {
            try {


                var path_outputs = path.join(pathProjectApp, 'outputs');
                if (!fs.existsSync(path_outputs)) {
                    fs.mkdirSync(path_outputs);
                }
                var path_signed = path.join(pathProjectApp, 'outputs', 'signed');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', nApp + '.ipa');
                console.log('r: ' + rFile);
                var wFile = path.join(path_signed, nApp + '.ipa');
                console.log('w: ' + wFile);
                fse.copy(rFile, wFile, err => {
                    if (err) return reject(err + '');
                    resolve('Copy file ipa unsign success.');
                });
            } catch (error) {
                reject(error);
            }
            // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.ipa'));
            // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', sess.appName + '.ipa'))
            //     .pipe(out);
            // out.on("end", resolve("copy success."));
            // out.on("error", reject(''));
        });
    }
    let copyFileApp = (pathProjectApp, nApp) => {
        return new Promise((resolve, reject) => {
            try {
                var path_outputs = path.join(pathProjectApp, 'outputs');
                if (!fs.existsSync(path_outputs)) {
                    fs.mkdirSync(path_outputs);
                }
                var path_signed = path.join(pathProjectApp, 'outputs', 'unsigned');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', nApp + '.app');
                var wFile = path.join(path_signed, nApp + '-debug.app');
                fse.copy(rFile, wFile, { replace: true }, (err) => {
                    if (err) return reject(err + '');
                    resolve('Copy file app unsign success.');
                });
            } catch (error) {
                reject(error);
            }
            // const out = fs.createWriteStream(path.join(path_signed, sess.appName + '.app'));
            // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'ios', 'build', 'emulator', sess.appName + '.app'))
            //     .pipe(out);
            // out.on("end", resolve("copy success."));
            // out.on("error", reject(''));
        });
    }
    let commandLine = (cmd, optionList) => {
        return new Promise((resolve, reject) => {
            try {
                var commandLine = crossSpawn.spawn(cmd, optionList);
                commandLine.stdout.on('data', function(data) {
                    console.log('data out: ' + data.toString());
                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                });
                commandLine.stderr.on('data', function(data) {
                    console.log('data error: ' + data.toString());
                    if (data instanceof Error) {
                        //console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                    if (data.toString().toLowerCase().indexOf('error') >= 0) {
                        // console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                });
                commandLine.on('close', function(code) {
                    if (code > 0) {
                        reject(new Error(code));
                    }
                    resolve('Success commandline.');
                });
            } catch (error) {
                reject(error);
            }
        })
    }


    let updateDB = (Condition, listArgv) => {
        return new Promise((resolve, reject) => {
            try {
                // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                Infomation.findOneAndUpdate({ keyFolder: Condition }, { $set: listArgv }, function(err, result) {
                    if (err) {
                        reject(err);
                    }
                    listBuilding.remove({ keyFolder: Condition }, function(err, kq) {
                        if (err) {
                            console.log('Error remove key building: ' + err);
                            reject(err);
                        }
                        resolve('Update db success.');
                    })
                });
            } catch (error) {
                reject(error);
            }
        })
    }
    let checkBuilding = (totalBuild, fKeyFolder) => {
        return new Promise(async(resolve, reject) => {
            try {
                let listBuild = new listBuilding({
                    keyFolder: fKeyFolder,
                    dateStartBuild: Date.now()
                });
                listBuild.save((err, result) => {
                    if (err) {
                        console.log('err save list build: ' + err);
                        reject(err);
                    }
                    // resolve('Insert building success.');
                    listBuilding.find({}).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                        if (err) {
                            console.log('Error find building: ' + err);
                            reject(err);
                        }
                        async.each(result, function(key) {
                            console.log('Check key: ' + key.keyFolder);
                            if (fKeyFolder == key.keyFolder) {
                                return resolve('Key success ');
                            }
                        });
                        var CheckKeyFolderInterval = setInterval(function() {
                            listBuilding.find({}).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                                if (err) {
                                    console.log('Error find building: ' + err);
                                    reject(err);
                                }
                                async.each(result, function(key) {
                                    console.log('Check key interval: ' + key.keyFolder);
                                    if (fKeyFolder == key.keyFolder) {
                                        clearInterval(CheckKeyFolderInterval);
                                        return resolve('Key success');
                                    }
                                });
                            });
                        }, 3000)
                    });
                });
            } catch (error) {
                console.log('Error total check build: ' + error);
                reject(error);
            }
        })
    }
    try {
        console.log('--------------------------------------------------------');
        console.log('===================== Build iOS App ====================');
        console.log('--------------------------------------------------------');
        console.log('Start build ios........');
        return checkBuilding(sumBuild, sKeyFolder).then(() => {
            var cmd = 'ionic';
            var argvBuild = ['cordova', 'build', 'ios', '--prod'];
            process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
            return commandLine(cmd, argvBuild)
        }).then(() => {
            console.log('copy file app unsign........');
            return copyFileApp(path.join(appRoot, 'public', 'project', sKeyFolder), sAppName);
        }).then(() => {
            console.log('Generate File build.json...');
            return generatesBuildFile(teamID, uUID, sKeyFolder);
        }).then(() => {
            var cmd = 'ionic';
            var argvBuild = ['cordova', 'build', 'ios', '--device', '--release', '--prod'];
            process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
            return commandLine(cmd, argvBuild)
        }).then(() => {
            console.log('copy file ipa signed........');
            return copyFileIpa(path.join(appRoot, 'public', 'project', sKeyFolder), sAppName);
        }).then(() => {
            var hostName = req.headers.host;
            var slinkDebug = path.join(hostServer, 'static', 'debug', sKeyFolder, sAppName + '.app');
            var slinkSigned = path.join(hostServer, 'static', 'signed', sKeyFolder, sAppName + '.ipa');
            slinkDebug = slinkDebug.replace(/ /g, '%20');
            slinkDebug = slinkDebug.replace("\\", "/");

            slinkSigned = slinkSigned.replace(/ /g, '%20');
            slinkSigned = slinkSigned.replace("\\", "/");

            // slinkDebug = 'http://' + slinkDebug;
            // slinkSigned = 'http://' + slinkSigned;
            var cond = sKeyFolder;
            var value = { linkDebug: slinkDebug, linkSigned: slinkSigned, stepBuild: 'builded' };
            return updateDB(cond, value);
        }).then(() => {
            return res.json({ status: "1", content: "Build success.", keyID: sKeyFolder });
        }).catch((ex) => {
            listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
                if (err) {
                    if (devMode == true)
                        return res.json({ status: "3", content: err + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
                Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: ex } }).exec((er, resUpdate) => {
                    if (er) {
                        if (devMode == true)
                            return res.json({ status: "3", content: er + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    console.log('lỗi: total' + ex + '');
                    if (devMode == true)
                        return res.json({ status: "3", content: ex + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                });

            });
        })
    } catch (error) {
        listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: error } }).exec((er, resUpdate) => {
                if (er) {
                    if (devMode == true)
                        return res.json({ status: "3", content: er + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
                console.log('lỗi: total' + ex + '');
                if (devMode == true)
                    return res.json({ status: "3", content: error + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            });

        });
    }
    // process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
    // var argvIonicstart = ['start', sess.appName, 'blank'];
    // return taydoCommandUtils.execIonicCommand(argvIonicstart)
    //     .then(function() {
    //         process.chdir(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
    //         var chmodRx = ['-R', '777', './'];
    //     })
    //     .then(function() {
    //         process.chdir(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
    //         var chmodRx = ['-R', '777', './'];
    //         return taydoCommandUtils.execChmodCommand(chmodRx);
    //     })
    //     .then(function() {
    //         return joinProject(path.join(appRoot, 'public', 'project', sess.folderAppMd5), path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
    //     })
    //     .then(function() {
    //         //  process.chdir(path_Project + dist + app_Name);
    //         var argv = ['platform', 'add', 'ios'];
    //         return taydoCommandUtils.execCordovaCommand(argv);
    //     }).then(function() {
    //         return generatesBuildFile(teamID, uuID, path.join(appRoot, 'public', 'project', sess.folderAppMd5));
    //     }).then(function() {
    //         var argv = ['build', 'ios'];
    //         return taydoCommandUtils.execCordovaCommand(argv);
    //     })
    //     .then(function() {
    //         var argv = ['build', 'ios', '--device', '--release'];
    //         return taydoCommandUtils.execCordovaCommand(argv);
    //     }).then(function() {
    //         return copyFileIpa(path.join(appRoot, 'public', 'project', sess.folderAppMd5));
    //     })
    //     .then(res.render('success'))
    //     .catch(function(ex) {
    //         if (ex instanceof Error) {
    //             console.log(ex);
    //         }
    //     });

});

module.exports = router;