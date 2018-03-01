var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    xml = require('xml'),
    async = require('async');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var moment = require('moment');
var router = express.Router();
var xml2js = require('xml2js');
var extract = require('extract-zip');
var provisioning = require('provisioning');
var browserDetect = require('browser-detect');
var libSetting = require('../lib/setting');
var hostServer = libSetting.hostServer;
// var plist = require('simple-plist');
// var convert = require('xml-js');

var parser = new xml2js.Parser();
var Infomation = require('../models/infomation');
router.get('/static/debug/:project/:app', function(req, res) {
    var project = req.params.project;
    var app = req.params.app;
    console.log(project);
    console.log(app);

    var pathFile = path.join(appRoot, 'public', 'project', project, 'outputs', 'unsigned', app);
    var pathFileBackupApk = path.join(appRoot, 'public', 'backupapk', project, 'unsigned', app);
    var pathFileBackupIpa = path.join(appRoot, 'public', 'backupipa', project, 'unsigned', app);
    console.log(pathFile);
    console.log(pathFileBackupApk);
    console.log(pathFileBackupIpa);
    if (fs.existsSync(pathFile)) res.download(pathFile);
    else if (fs.existsSync(pathFileBackupApk)) res.download(pathFileBackupApk);
    else if (fs.existsSync(pathFileBackupIpa)) res.download(pathFileBackupIpa);
    else {
        Infomation.find({
                keyFolder: project
            }).exec((err, result) => {
                if (err) {
                    console.log('Static file:' + err);
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
                }
                if (result.length > 0) {
                    return res.render('not-folder-app', {
                        title: 'App Not Found'
                    });
                } else
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
            })
            // if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
            //     return res.render('not-folder-app', { title: 'App Not Found' });
            // }
            // res.render('404', { title: '404' });
    }
});
router.get('/static/signed/:project/:app', function(req, res) {
    var project = req.params.project;
    var app = req.params.app;
    console.log(project);
    console.log(app);
    var pathFile = path.join(appRoot, 'public', 'project', project, 'outputs', 'signed', app);
    var pathFileBackup = path.join(appRoot, 'public', 'backupapk', project, 'signed', app);
    var pathFileBackupIpa = path.join(appRoot, 'public', 'backupipa', project, 'signed', app);
    console.log(pathFile);
    if (fs.existsSync(pathFile)) res.download(pathFile);
    else if (fs.existsSync(pathFileBackup)) res.download(pathFileBackup);
    else if (fs.existsSync(pathFileBackupIpa)) res.download(pathFileBackupIpa);
    else {
        Infomation.find({
            keyFolder: project
        }).exec((err, result) => {
            if (err) {
                console.log('Static file:' + err);
                return res.render('404', {
                    title: 'Page Not Found'
                });
            }
            if (result.length > 0) {
                return res.render('not-folder-app', {
                    title: 'App Not Found'
                });
            } else
                return res.render('404', {
                    title: 'Page Not Found'
                });
        })
    }
    // res.render('404', { title: '404' });
});
router.get('/download-keystore/:project', function(req, res) {
    var project = req.params.project;
    console.log(project);

    var pathFileKeyStore = path.join(appRoot, 'public', 'backupapk', project, 'signed', 'my-release-key.keystore');

    console.log(pathFileKeyStore);

    if (fs.existsSync(pathFileKeyStore)) res.download(pathFileKeyStore);
    // else if (fs.existsSync(pathFileBackupApk)) res.download(pathFileBackupApk);
    // else if (fs.existsSync(pathFileBackupIpa)) res.download(pathFileBackupIpa);
    else {
        Infomation.find({
                keyFolder: project
            }).exec((err, result) => {
                if (err) {
                    console.log('Static file:' + err);
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
                }
                if (result.length > 0) {
                    return res.render('not-folder-app', {
                        title: 'App Not Found'
                    });
                } else
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
            })
            // if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
            //     return res.render('not-folder-app', { title: 'App Not Found' });
            // }
            // res.render('404', { title: '404' });
    }
});
router.get('/download-keystoretxt/:project', function(req, res) {
    var project = req.params.project;
    console.log(project);

    var pathFileKeyStore = path.join(appRoot, 'public', 'backupapk', project, 'signed', 'keystore.txt');

    console.log(pathFileKeyStore);

    if (fs.existsSync(pathFileKeyStore)) res.download(pathFileKeyStore);
    // else if (fs.existsSync(pathFileBackupApk)) res.download(pathFileBackupApk);
    // else if (fs.existsSync(pathFileBackupIpa)) res.download(pathFileBackupIpa);
    else {
        Infomation.find({
                keyFolder: project
            }).exec((err, result) => {
                if (err) {
                    console.log('Static file:' + err);
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
                }
                if (result.length > 0) {
                    return res.render('not-folder-app', {
                        title: 'App Not Found'
                    });
                } else
                    return res.render('404', {
                        title: 'Page Not Found'
                    });
            })
            // if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
            //     return res.render('not-folder-app', { title: 'App Not Found' });
            // }
            // res.render('404', { title: '404' });
    }
});
router.get('/getfile-zip/:project', function(req, res) {
    try {
        var project = req.params.project;
        // var app = req.params.app;
        console.log(project);
        // console.log(app);
        Infomation.find({
                keyFolder: project
            }).exec((err, result) => {
                if (err) {
                    console.log('Static file:' + err);
                    return res.json({
                        status: '3',
                        content: 'Error get file zip'
                    });
                }
                if (result.length <= 0) {
                    return res.json({
                        status: '1',
                        content: 'Not find project'
                    });
                } else {
                    if (fs.existsSync(path.join(appRoot, 'public', 'project', project + '.zip'))) {
                        return res.sendFile(path.join(appRoot, 'public', 'project', project + '.zip'));
                    } else {
                        return res.json({
                            status: '3',
                            content: 'Not exist file zip'
                        });
                    }

                }

            })
            // var pathFile = path.join(appRoot, 'public', 'project', project, 'outputs', 'unsigned', app);
    } catch (error) {
        return res.json({
            status: '3',
            content: error
        });
    }
});

router.get('/send-zipipa/:project', function(req, res) {
    try {
        var project = req.params.project;
        // var app = req.params.app;
        console.log(project);
        // console.log(app);
        Infomation.find({
                keyFolder: project
            }).exec((err, result) => {
                if (err) {
                    console.log('Static file:' + err);
                    return res.json({
                        status: '3',
                        content: 'Error get file zip'
                    });
                }
                if (result.length <= 0) {
                    return res.json({
                        status: '1',
                        content: 'Not find project'
                    });
                } else {
                    if (fs.existsSync(path.join(appRoot, 'public', 'backupipa', project + '.zip'))) {
                        return res.sendFile(path.join(appRoot, 'public', 'backupipa', project + '.zip'));
                    } else {
                        return res.json({
                            status: '3',
                            content: 'Not exist file zip'
                        });
                    }
                }
            })
            // var pathFile = path.join(appRoot, 'public', 'project', project, 'outputs', 'unsigned', app);
    } catch (error) {
        return res.json({
            status: '3',
            content: error
        });
    }
});

router.get('/get-zipipa/:project', async function(req, res) {
    try {

        var project = req.params.project;
        console.log(project);
        var linkOutPuts;
        let result = await Infomation.find({ keyFolder: project }).exec();
        if (result.length < 1) {
            return res.json({ status: '3', content: 'Not Find Project' });
        }
        if (fs.exists(path.join(appRoot, 'public', 'project', project, 'outputs.zip'))) {
            fse.removeSync(path.join(appRoot, 'public', 'project', project, 'outputs.zip'));
        }
        async.each(result, function(returnRes) {
            linkOutPuts = returnRes.linkOutPuts;
        });
        var linkPipe = path.join(appRoot, 'public', 'project', project, 'outputs.zip');
        var file = fs.createWriteStream(linkPipe);
        var request = http.get(linkOutPuts, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close();
                console.log('success get file');
                return res.json({ status: '1', content: 'Get file zip outputs.zip Success.' });
            });

        }).on('error', function(err) { // Handle errors
            fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
            console.log('unlink: ' + err);
            return res.json({ status: '3', content: 'Get zip file outputs.zip Error.' });
        });
    } catch (error) {
        console.log(error);
        return res.json({ status: '3', content: 'Get zip file outputs.zip Errors.' });
    }

});
router.get('/getfolderfile/:file', function(req, res) {
    try {
        var fileName = req.params.file;
        console.log(fileName);
        var linkFile = path.join(appRoot, 'public', 'datafile', fileName);
        console.log(linkFile);
        if (fs.existsSync(linkFile)) {
            res.download(linkFile);
        } else {
            res.render('404', { title: "File Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.render('404', { title: "File Not Found" });
    }
});
router.get('/download-ipa/:project', function(req, res) {
    try {
        var projectName = req.params.project;
        var pathFile = path.join(appRoot, 'public', 'backupipa', projectName, 'unsigned');
    } catch (error) {
        console.log(error);
        res.render('error', { title: 'Error Data', error });
    }
});
router.get('/getanyfile', function(req, res) {
    try {
        var pathParam, pathFile;
        if (typeof req.query.f !== 'undefined') {
            pathParam = req.query.f;
        }
        console.log(pathParam);
        pathFile = path.join(appRoot, 'public', pathParam);
        if (fs.existsSync(pathFile)) {
            res.download(pathFile);
        } else {
            res.render('404', { title: 'Not found' });
        }
    } catch (error) {
        console.log(error);
        res.render('error', { title: 'Error Data', error });
    }
});
router.get('/get-plist/', (req, res) => {

    var pathFilePlist = path.join(appRoot, 'public', 'datafile', 'manifest.plist');

    fs.readFile(pathFilePlist, function(error, result) {
        console.log(result);
        res.set('Content-Type', 'application/xml');
        res.send(result);
        //     // res.send(data);
    });
});
router.get('/get-plist/:project', (req, res) => {
    var sKeyFolder = req.params.project;
    console.log(sKeyFolder);
    var pathFilePlist = path.join(appRoot, 'public', 'backupipa', sKeyFolder, 'manifest.plist');
    if (fs.existsSync(path.join(appRoot, 'public', 'backupipa', sKeyFolder, 'manifest.plist'))) {
        fs.readFile(pathFilePlist, function(error, result) {
            console.log(result);
            res.set('Content-Type', 'application/xml');
            res.send(result);
            //     // res.send(data);
        });
    } else {
        console.log('Not Find Folder');
        res.render('not-folder-app', { title: 'Not App Folder' });
    }
});
router.get('/install-ios-app/:project', async(req, res) => {
    try {


        var sKeyFolder = req.params.project;
        var sAppName;
        var sBundleIDApp, arrBundle, iArrBundle, sDate, sDevice, iAppName;
        let result = await Infomation.find({ keyFolder: sKeyFolder }).exec();
        if (result.length > 0) {
            async.each(result, function(kq) {
                sAppName = kq.appName;
                console.log('sAppName' + sAppName);
            });
            var dirFileIPA = path.join(appRoot, 'public', 'backupipa', sKeyFolder, 'unsigned', sAppName + '-test.ipa');
            extract(dirFileIPA, { dir: path.join(appRoot, 'public', 'backupipa', sKeyFolder) }, function(err) {
                if (err) {
                    console.log('Extract fail: ' + err);
                    return res.render('error', { title: 'Error Data' });
                }
                console.log('extract success');
                var appFolderUnzip = fs.readdirSync(path.join(appRoot, 'public', 'backupipa', sKeyFolder, 'Payload'));
                console.log(appFolderUnzip);
                console.log(appFolderUnzip[0]);
                var plistFile = path.join(appRoot, 'public', 'backupipa', sKeyFolder, 'Payload', appFolderUnzip[0], 'embedded.mobileprovision');
                provisioning(plistFile, function(error, data) {
                    if (error) {
                        return res.render('error', { title: 'Error data' });
                    }
                    console.log(data);
                    console.log(data.Entitlements['application-identifier']);
                    arrBundle = data.Entitlements['application-identifier'];
                    iArrBundle = arrBundle.split('.');
                    console.log(iArrBundle);
                    iArrBundle.shift();
                    // iArrBundle.join('.');
                    // console.log('kq: ' + iArrBundle);
                    var i = 0;
                    async.each(iArrBundle, function(item) {
                        if (i == 0) {
                            sBundleIDApp = item;
                        } else {
                            sBundleIDApp += '.' + item;
                        }
                        // console.log(item);
                        i++;
                    })
                    console.log(sBundleIDApp);
                    sDate = data.CreationDate;
                    console.log(sDate);
                    sDevice = data.ProvisionedDevices;
                    console.log(sDevice);
                    iAppName = data.AppIDName
                    console.log(iAppName);
                    ////////
                    var checkSafari;
                    var browserInfo = browserDetect(req.headers['user-agent']);
                    console.log(browserInfo);
                    var nameBrowser = browserInfo.name;
                    console.log('nameBrowser: ' + nameBrowser);
                    if (nameBrowser == 'ios') {
                        console.log('checked safari');
                        checkSafari = true;
                    } else {
                        console.log('not checked safari');
                        checkSafari = false;
                    }
                    console.log(checkSafari);
                    // => { "AppIDName": "com.facebook.facebook", 
                    //      "TeamName": "Facebook Inc.", 
                    //      ... }
                    return res.render('install-ios-app', { title: 'Install app iOS', hostServer: hostServer, keyFolder: sKeyFolder, appName: sAppName, bundleID: sBundleIDApp, sDate: sDate, sDevice: sDevice, moment: moment, CheckSafari: checkSafari });
                });
            });

        } else {
            return res.render('not-folder-app', { title: 'Not App Folder' });
        }

    } catch (error) {
        console.log(error);
        res.render('error', { title: 'Error Data' });
    }

});
router.get('/install-ios-app-test', async(req, res) => {
    var checkSafari = false;
    var browserInfo = browserDetect(req.headers['user-agent']);
    console.log(browserInfo);
    var nameBrowser = browserInfo.name;
    if (nameBrowser == 'safari')
        CheckSafari = true;
    console.log(checkSafari);
    return res.render('install-ios-app', { keyFolder: 'UuvZps12c983d32e1ae6a649e16998a8037403', appName: 'App TaydoTech', bundleID: 'com.taydo.test', sDate: '2017-11-10 10:24:22', sDevice: '', moment: moment, CheckSafari: checkSafari });
});
router.get('/callback-diawi', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.render('test.ejs');
});
module.exports = router;