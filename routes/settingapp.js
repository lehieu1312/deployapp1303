var express = require('express');
var extract = require('extract-zip');
var path = require('path'),
    request = require('request'),
    md5 = require('md5'),
    fse = require('fs-extra'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    async = require('async'),
    multipart = require('connect-multiparty');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multipartMiddleware = multipart();
var parser = new xml2js.Parser();
var router = express.Router();
let Infomation = require('../models/infomation');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
router.get('/setting-app/:fkey', function(req, res) {
    var fKeyFolder = req.params.fkey;
    var linkAppDebug, linkAppSigned, qrCodeUnsign, qrCodeSign, sAppName, sStepBuild, cParams, sPlatform;
    try {
        console.log('fkey: ' + fKeyFolder);
        Infomation.find({ keyFolder: fKeyFolder }).exec((err, result) => {
            if (err) {
                console.log(err);
                return res.render('error', { error: err, title: 'Error Data' });
            }
            console.log('res: ' + result);
            console.log('res lenght: ' + result.length);
            // console.log('params: ' + result.isParams);
            if (result.length > 0) {

                async.each(result, function(kq) {
                    // var mang = kq.keyFolder;
                    linkAppDebug = kq.linkDebug;
                    console.log('link debug app:' + linkAppDebug);
                    linkAppSigned = kq.linkSigned;
                    console.log('link signed app:' + linkAppSigned);
                    sAppName = kq.appName;
                    console.log('params: ' + kq.isParams);
                    cParams = kq.isParams;
                    console.log('pathRootFolder: ' + kq.pathRootFolder);
                    cPathRootFolder = kq.pathRootFolder;
                    console.log('linkParams: ' + kq.linkParams);
                    cLinkParams = kq.linkParams;
                    aStep = kq.stepBuild;
                    console.log('stepBuild: ' + aStep);
                    sPlatform = kq.platforms;
                    console.log('platforms: ' + sPlatform);
                });

                if (aStep == 'uploaded' && cParams == true) {
                    console.log('clink: ' + cLinkParams);
                    if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
                        return res.render('not-folder-app', { title: 'App Not Found' });
                    }
                    fs.readFile(cLinkParams, 'utf8', function(error, data) {
                        if (error) {
                            console.log('ERR read file params.xml: ' + err + '');
                            return res.render('error', { error, title: 'Error Data' });
                        } else {
                            parser.parseString(data, function(error, result) {
                                if (error) {
                                    console.log(err);
                                    return res.render('error', { error, title: 'Error Data' });
                                }
                                console.log('file params');
                                console.log('arrFile: ' + result['root']['file']);
                                var arrFile = result['root']['file'];
                                console.log('arr: ' + arrFile);
                                // return res.render('info-app', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                                return res.render('setting-app', { arrFile, fKeyFolder, cPathRootFolder, title: 'Mobile App Builder For iOS and Android Step 2' });
                            });
                        }
                    });

                    // return res.redirect('/infoapp/' + fKeyFolder);
                } else if (aStep == 'uploaded' && cParams == false) {
                    return res.redirect('/platforms/' + fKeyFolder);
                } else if (aStep == 'installed') {
                    return res.redirect('/platforms/' + fKeyFolder);
                } else if (aStep == 'addedPlatform') {
                    if (sPlatform == 'android')
                        return res.redirect('/build-android/' + fKeyFolder);
                    else
                        return res.redirect('/build-ios/' + fKeyFolder);

                } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'android') {
                    return res.redirect('/success/' + fKeyFolder);
                } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'ios') {
                    console.log('success ios');
                    return res.redirect('/success-ios/' + fKeyFolder);
                } else {
                    console.log('=====loi=======');
                    return res.render('404', { title: 'Page Not Found' });
                }


            } else {
                res.render('404', { title: 'Page Not Found' });
            }


            // console.log('params end');
        })
    } catch (error) {
        res.render('error', { error, title: 'Error Data' });
    }

    // var arrFile = req.cookies.arrFile;
    // console.log(arrFile);
    // if (arrFile == undefined) {
    //     res.render('index', { title: 'Mobile App Builder For iOS and Android' });
    // } else {

    // }
});
router.post('/setting-app', async function(req, res, next) {
    try {
        // console.log('start info');
        // console.log('123');
        console.log('--------------------------------------------------------');
        console.log('======================= Setting App ====================');
        console.log('--------------------------------------------------------');
        var inputValue = req.body;
        var rootPath, fkeyFolder;
        console.log('input: ' + JSON.stringify(inputValue));
        var arrCheckFile = [];
        rootPath = req.body.pathRoot;
        fkeyFolder = req.body.keyFolder;
        console.log(rootPath);
        // async.each(inputValue, function(returnValue) {
        //     console.log('returnValue: ' + returnValue);
        // });
        let checkJSONFunction = (str) => {

            try {
                var checkJSON = JSON.parse(body);
                console.log(typeof checkJSON);
                if (typeof checkJSON == 'object') {
                    return true;
                }
            } catch (error) {
                return false;
            }


        }
        let checkWordpressUrl = (urlStr) => {
                return new Promise((resolve, reject) => {
                    try {
                        request.get(urlStr + '/wp-json', async(err, respone, body) => {
                            if (err) {
                                console.log(err);
                                reject(false);
                                // return res.json({ status: "2", content: 'Enter valid URL to your wordpress, like: http(s)://your_website.com' });
                            }
                            console.log(typeof body);
                            // console.log('respone: ' + JSON.stringify(respone));
                            console.log(respone.statusCode);
                            if (respone.statusCode == '200') {
                                if (checkJSONFunction(body) == false) {
                                    reject(false);
                                    // return res.json({ status: "2", content: 'Enter valid URL to your wordpress, like: http(s)://your_website.com' });
                                } else
                                    resolve(true);
                            } else {
                                reject(false);
                            }
                            // console.log('body: ' + body);
                        });
                    } catch (error) {
                        console.log(error);
                        reject(false);
                    }
                })

            }
            // async.forEachOf(inputValue, (value, key) => {
            //     var keyMainPop = key.split('=').pop();
            //     console.log('keyMainPop: ' + keyMainPop);
            //     if (keyMainPop == 'WORDPRESS_URL') {
            //         var resCheckUrl;
            //         request.get(value + '/wp-json', async(err, respone, body) => {
            //             if (err) {
            //                 console.log(err);
            //                 return res.json({ status: "2", content: 'Enter valid URL to your wordpress, like: http(s)://your_website.com' });
            //             }
            //             console.log(typeof body);
            //             // console.log('respone: ' + JSON.stringify(respone));
            //             console.log(respone.statusCode);
            //             if (respone.statusCode == '200') {
            //                 if (checkJSONFunction(body) == false) {
            //                     // reject(false);
            //                     return res.json({ status: "2", content: 'Enter valid URL to your wordpress, like: http(s)://your_website.com' });
            //                 }
            //             } else {
            //                 return res.json({ status: "2", content: 'Enter valid URL to your wordpress, like: http(s)://your_website.com' });
            //             }
            //             // console.log('body: ' + body);

        //         });
        //         // console.log(checkWordpressUrl(value));



        //     }
        // });
        async.forEachOf(inputValue, (value, key) => {
            // console.log('value: ' + value);
            // console.log('key: ' + key);
            // var keyMainPop = key.split('=').pop();
            // console.log('keyMainPop: ' + keyMainPop);

            console.log('key: ' + key);
            if (key != 'pathRoot' && key != 'keyFolder') {
                var fileNameDefault = key.split('=').shift().split('.').shift() + '-example' + '.' + key.split('=').shift().split('.').pop();
                var fileNamePrimary = key.split('=').shift().split('.').shift() + '.' + key.split('=').shift().split('.').pop();
                // console.log('fileNamePrimary: ' + fileNamePrimary);
                var fileNamePrimaryDemo = key.split('=').shift();
                // console.log('fileNamePrimaryDemo: ' + fileNamePrimaryDemo);
                var keyMain = key.split('=').pop();
                // console.log('keyMain: ' + keyMain);
                var pathFileDefault = path.join(appRoot, 'public', 'temporary', rootPath, fileNameDefault);
                var pathFilePrimary = path.join(appRoot, 'public', 'temporary', rootPath, fileNamePrimary);
                // console.log(pathFilePrimary);

                if (arrCheckFile.indexOf(pathFilePrimary) == -1) {
                    // console.log('path default: ' + pathFileDefault);
                    if (fs.existsSync(pathFileDefault)) {
                        fse.copySync(pathFileDefault, pathFilePrimary);
                        arrCheckFile.push(pathFilePrimary);
                        // console.log('1');
                    } else {
                        return res.json({ status: "3", content: "The example file is not found: " + fileNameDefault, keyFolder: fkeyFolder });
                    }
                }
                // console.log('2');

                var data = fs.readFileSync(pathFilePrimary);
                var result = data.toString().replace(key.split('=').pop(), inputValue[key]);
                var outFile = fs.writeFileSync(pathFilePrimary, result);

            }

            //  var arrPathName = key.split('=').shift();


        });
        // for (var key in inputValue) {
        //     //  var arrPathName = key.split('=').shift();
        //     console.log('key: ' + key);
        //     if (key != 'pathRoot' && key != 'keyFolder') {
        //         var fileNameDefault = key.split('=').shift().split('.').shift() + '-example' + '.' + key.split('=').shift().split('.').pop();
        //         var fileNamePrimary = key.split('=').shift().split('.').shift() + '.' + key.split('=').shift().split('.').pop();
        //         console.log('fileNamePrimary: ' + fileNamePrimary);
        //         var fileNamePrimaryDemo = key.split('=').shift();
        //         console.log('fileNamePrimaryDemo: ' + fileNamePrimaryDemo);
        //         var keyMain = key.split('=').pop();
        //         console.log('keyMain: ' + keyMain);
        //         var pathFileDefault = path.join(appRoot, 'public', 'temporary', rootPath, fileNameDefault);
        //         var pathFilePrimary = path.join(appRoot, 'public', 'temporary', rootPath, fileNamePrimary);
        //         // console.log(pathFilePrimary);

        //         if (arrCheckFile.indexOf(pathFilePrimary) == -1) {
        //             console.log('path default: ' + pathFileDefault);
        //             if (fs.existsSync(pathFileDefault)) {
        //                 fse.copySync(pathFileDefault, pathFilePrimary);
        //                 arrCheckFile.push(pathFilePrimary);
        //                 // console.log('1');
        //             } else {
        //                 return res.json({ status: "3", content: "The example file is not found: " + fileNameDefault, keyFolder: fkeyFolder });
        //             }
        //         }
        //         // console.log('2');

        //         var data = fs.readFileSync(pathFilePrimary);
        //         var result = data.toString().replace(key.split('=').pop(), inputValue[key]);
        //         var outFile = fs.writeFileSync(pathFilePrimary, result);

        //     }
        // }
        try {
            let result = await Infomation.findOneAndUpdate({ keyFolder: fkeyFolder }, { $set: { stepBuild: 'installed' } }).exec();
            res.json({ status: "1", content: "success", keyFolder: fkeyFolder });
        } catch (error) {
            if (devMode == true)
                return res.json({ status: "3", content: error + '' });
            else
                return res.json({ status: "3", content: 'Oops, something went wrong' });
        }

    } catch (error) {
        console.log('err: ' + error);
        if (devMode == true)
            res.json({ status: "3", content: error + '' });
        else
            return res.json({ status: "3", content: 'Oops, something went wrong' });
        //res.render('index', { title: 'Mobile App Builder For iOS and Android' });
    }
    //, 
    //next();
});


module.exports = router;