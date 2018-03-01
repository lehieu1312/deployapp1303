var express = require('express');
var extract = require('extract-zip');
var path = require('path'),
    md5 = require('md5'),
    fse = require('fs-extra'),
    multer = require('multer'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    multipart = require('connect-multiparty'),
    bodyParser = require('body-parser'),
    moment = require('moment');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multipartMiddleware = multipart();
var router = express.Router();
var parser = new xml2js.Parser();
let Infomation = require('../models/infomation');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var typeScriptVersion = libSetting.verTypeScriptCheck;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(appRoot, 'public', 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(false, file.originalname);
    }
});
let zipFilter = (req, file, cb) => {
    // accept image only
    if (!file.originalname.match(/\.(zip)$/)) {
        return cb(new Error('Only zip files are allowed!'), false);
    }
    cb(null, true);
};
var limit = {
    fileSize: 200 * 1024 * 1024
}
var upload = multer({
    storage: storage,
    limits: limit,
    fileFilter: zipFilter
}).single('uploads')

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1e3,
        d = b || 2,
        e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + "" + e[f]
}
router.get('/upload', function(req, res) {
    res.redirect('/index');
});
router.post('/upload', urlencodeParser, function(req, res, next) {
    var dbNameFolder = makeid() + md5(Date.now());
    var dbPathRootFolder = "";
    var dbTypeApp = "";
    var dbTypeFolder = "";
    var sAppName = "";
    var sFileNameLocal = '';
    var sSizeFileUpload = '';
    // console.log('uploads: ' + req.files);
    // console.log('uploads: ' + req.file.originalname);
    // /path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'config.xml')
    let getAppName = (pathFile) => {
            return new Promise((resolve, reject) => {
                if (fs.existsSync(pathFile)) {
                    console.log('config');
                    fs.readFile(pathFile, 'utf8', function(err, data) {
                        console.log('path: ' + pathFile);
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                        parser.parseString(data, function(err, result) {
                            // console.log('parser: ' + JSON.stringify(result))
                            if (err) {
                                console.log(err);
                                return reject(err);
                            }
                            console.log('result: ' + result);
                            var cAppName = result.widget.name[0];
                            console.log('app name 1: ' + cAppName);
                            resolve(cAppName);

                        });

                    });
                }
            })
        }
        ///// Upload file //////////////////////
    try {
        console.log('--------------------------------------------------------');
        console.log('==================== Upload File App ===================');
        console.log('--------------------------------------------------------');
        upload(req, res, function(err) {
            if (err) {
                console.log('lỗi: ' + err);
                if (devMode == true)
                    return res.json({ status: "3", content: 'upload file fail: ' + err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            } else if (err && err.code === 'LIMIT_FILE_SIZE') {
                console.log('File large size');
                return res.json({ status: "3", content: "File is too large. The max filesize for your plan is 200Mb." });
            } else {
                console.log('Upload Success...');
                console.log('File name: ' + req.file.originalname);
                console.log(path.extname(req.file.originalname));
                console.log('size: ' + (req.file.size));
                console.log('Rename File...');
                sSizeFileUpload = formatBytes(req.file.size);
                sFileNameLocal = req.file.originalname;
                console.log('sizeChange: ' + sSizeFileUpload);
                console.log('sFileNameLocal: ' + sFileNameLocal);
                fs.renameSync(path.join(appRoot, 'public', 'uploads', req.file.originalname), path.join(appRoot, 'public', 'uploads', dbNameFolder + path.extname(req.file.originalname)));
                // console.log(req.cookies.nameFolder);
                if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', dbNameFolder))) {

                    //////// Extract file ///////////////
                    console.log('Extract File...');
                    extract(path.join(appRoot, 'public', 'uploads', dbNameFolder + path.extname(req.file.originalname)), { dir: path.join(appRoot, 'public', 'temporary', dbNameFolder) }, async function(err, zipdata) {
                        if (err) {
                            console.log('Extract fail: ' + err);
                            if (devMode == true)
                                return res.json({ status: "3", content: "Error extract file: " + err + '' });
                            else
                                return res.json({ status: "3", content: 'Oops, something went wrong' });
                        } else {
                            ////// Check project cordova////////////////////
                            // ----------------------------------------------------------------------------------------
                            ////Read folder uploaded
                            var folder = fs.readdirSync(path.join(appRoot, 'public', 'temporary', dbNameFolder));

                            //////// Check folder type 1 ////////////////////
                            if (folder.length > 1) {
                                console.log('List Folder 1: ' + folder);
                                dbPathRootFolder = dbNameFolder;
                                dbTypeFolder = 1;
                                console.log('Type Folder 1');
                                if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'www')) ||
                                    !fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'config.xml'))
                                ) {
                                    return res.json({ status: "3", content: "The file is not a Cordova's project" }); //res.render('upload', { errors: 'Not project cordova' });
                                }
                            } else {
                                /////////// Check folder type 2 ////////////////
                                var fApp = folder[0];
                                dbTypeFolder = 2;
                                console.log('Type Folder 2');
                                console.log('List Folder 2: ' + fApp);
                                dbPathRootFolder = dbNameFolder + '/' + fApp;
                                console.log('dbPath: ' + dbPathRootFolder);
                                console.log('Checking Project Cordova...');
                                if (!fs.lstatSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder)).isDirectory()) {
                                    console.log('File(1) upload not folder project');
                                    return res.json({ status: "3", content: "The file is not a Cordova's project" });
                                } else {
                                    var folderParent = fs.readdirSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder));
                                    if (folderParent.length <= 1 || !fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'www')) ||
                                        !fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'config.xml'))
                                    ) {
                                        console.log('File(2) upload not folder project');
                                        return res.json({ status: "3", content: "The file is not a Cordova's project" });
                                    }
                                }
                            }
                            ///////// Check project ionic type 2,3 //////////////
                            if (fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'src'))) {
                                if (fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'ionic.config.json')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'package.json')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'tsconfig.json')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'tslint.json')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'node_modules')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'hooks')) &&
                                    fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'resources')))
                                    dbTypeApp = 2;
                                else {
                                    console.log('File(3) upload not folder project');
                                    return res.json({ status: "3", content: " The file is not a Cordova's project " });
                                }

                            } else {
                                dbTypeApp = 1;
                            }

                            try {
                                console.log(dbPathRootFolder);
                                sAppName = await getAppName(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'config.xml'));
                                console.log('App name : ' + sAppName);
                            } catch (error) {
                                console.log('1: ' + error + '');
                                return res.json({ status: "3", content: "Can't get app name" });
                            }
                            //Check version typescript
                            try {
                                if (fs.existsSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'package.json'))) {
                                    var json = JSON.parse(fs.readFileSync(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'package.json'), 'utf8'))
                                    var verTypescipt = json.devDependencies.typescript;
                                    var reCheck = '^';
                                    console.log('verTypescipt: ' + verTypescipt);
                                    if (typeof verTypescipt != 'undefined') {
                                        var reVerTypeScript = verTypescipt.replace(reCheck, '');
                                        console.log('reVerTypeScript: ' + reVerTypeScript);
                                        var arrVerTypeScriptPackage = reVerTypeScript.split('.');
                                        var arrVerTypeScriptLibSetting = typeScriptVersion.split('.');
                                        if (arrVerTypeScriptPackage[0] < arrVerTypeScriptLibSetting[0]) {
                                            console.log('loi check 1');
                                            return res.json({ status: "3", content: "The Typescript in your package is not compatible. <br> Minimum supported Typescript version is 2.3.2 <br> Please recheck package.json file in your package and upgrade typescript to 2.3.2 or newer version." });
                                        } else if (arrVerTypeScriptPackage[1] < arrVerTypeScriptLibSetting[1]) {
                                            console.log('loi check 2');
                                            return res.json({ status: "3", content: "The Typescript in your package is not compatible. <br> Minimum supported Typescript version is 2.3.2 <br> Please recheck package.json file in your package and upgrade typescript to 2.3.2 or newer version." });
                                        } else if (arrVerTypeScriptPackage[2] < arrVerTypeScriptLibSetting[2]) {
                                            console.log('loi check 3');
                                            return res.json({ status: "3", content: "The Typescript in your package is not compatible. <br> Minimum supported Typescript version is 2.3.2 <br> Please recheck package.json file in your package and upgrade typescript to 2.3.2 or newer version." });
                                        } else {

                                        }
                                    }
                                }
                            } catch (error) {
                                console.log(error);
                                return res.json({ status: "3", content: "Error: Can't check version" });
                            }
                            // typeScriptVersion
                            // console.log('Date: ' + moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'));
                            // var arrFileUpload = [];
                            // var itemFileUpload = {
                            //     fileName: sFileNameLocal,
                            //     dateCreate: moment(Date.now()).format('YYYY/MM/DD hh:mm'),
                            //     sizeFile: sSizeFileUpload,
                            //     keyFolder: dbNameFolder
                            // };
                            // console.log('0');
                            // if (req.cookies.arrFileUploadedDeployapp) {
                            //     console.log('1');
                            //     var arrCk = req.cookies.arrFileUploadedDeployapp;
                            //     console.log('arrCK 1: ' + JSON.stringify(arrCk));
                            //     arrCk.push(itemFileUpload);
                            //     console.log('arrCK 1.1: ' + JSON.stringify(arrCk));
                            //     res.cookie('arrFileUploadedDeployapp', arrCk, { maxAge: 31536000000, httpOnly: false });
                            //     console.log('arrFileUploaded 1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                            // } else {
                            //     console.log('2');
                            //     console.log('arrFileUploaded 2: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                            //     arrFileUpload.push(itemFileUpload);
                            //     console.log('arrFileUpload: ' + JSON.stringify(arrFileUpload));
                            //     res.cookie('arrFileUploadedDeployapp', arrFileUpload, { maxAge: 31536000000, httpOnly: false });
                            //     console.log('arrFileUploaded 2.1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                            // }
                            // var arrFileName = [
                            //     { name: 'modernshop1.zip', dateCreate: '2017-12-09 10:50', sizeFile: '150Mb', nameFolder: '1231hjgkkLd160GGG' },
                            //     { name: 'modernshop2.zip', dateCreate: '2017-12-09 10:38', sizeFile: '155Mb', nameFolder: '98hg1hgkkLd160KLJ' },
                            //     { name: 'modernshop3.zip', dateCreate: '2017-12-09 10:24', sizeFile: '158Mb', nameFolder: 'lK671hjgkkLd1GTL0' }
                            // ]
                            // res.cookie('arrFileUploaded', arrCk);
                            // console.log('cookie: ' + JSON.stringify(req.cookies.arrFileUploaded));
                            // arrFileUpload.push(itemFileUpload);
                            // set_cookies.push(getCookie('arrFileUpload', itemFileUpload));
                            // console.log(req.cookies.arrFileUpload);
                            // res.cookie('cokkieFileUploaded', arrFileName, { maxAge: 259200000, httpOnly: true })

                            ///////// Insert infomation in db /////////////////////
                            let infomation = new Infomation({
                                keyFolder: dbNameFolder,
                                typeApp: dbTypeApp,
                                linkAppDebug: '',
                                linkAppSigned: '',
                                dateCreateLocal: moment(Date.now()).format(),
                                sizeFileZipUpload: sSizeFileUpload,
                                typeFolder: dbTypeFolder,
                                pathRootFolder: dbPathRootFolder,
                                platforms: '',
                                logError: '',
                                appName: sAppName,
                                dateCreate: Date.now(), // moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                                status: 1
                            });
                            infomation.save((err, kq) => {
                                if (err) {
                                    console.log('loi: ' + err);
                                    if (devMode == true)
                                        return res.json({ status: "3", content: err + '' });
                                    else
                                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                                }
                                // console.log('info : ' + Infomation);
                                var xml = path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'www', 'params.xml');
                                console.log(xml);
                                if (fs.existsSync(xml)) {
                                    try {
                                        Infomation.update({ keyFolder: dbNameFolder }, { $set: { isParams: true, linkParams: xml, stepBuild: 'uploaded' } }, { upsert: false }, function(err, result) {
                                            if (err) {
                                                if (devMode == true)
                                                    return res.json({ status: "3", content: "Error update data: " + err + '' });
                                                else
                                                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                                            }
                                            return res.json({ status: "2", content: "setting-app", keyFolder: dbNameFolder });
                                        });
                                    } catch (error) {
                                        if (devMode == true)
                                            return res.json({ status: '3', content: 'Error update data: ' + error + '' });
                                        else
                                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                                    }

                                } else {
                                    console.log('2: File params not found');
                                    try {
                                        Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false, stepBuild: 'uploaded' } }, { upsert: false }, function(err, result) {
                                            if (err) {
                                                if (devMode == true)
                                                    return res.json({ status: "3", content: "Error update data: " + err + '' });
                                                else
                                                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                                            }
                                            return res.json({ status: "1", content: "platform", keyFolder: dbNameFolder });
                                        });
                                    } catch (error) {
                                        if (devMode == true)
                                            return res.json({ status: '3', content: 'Error update data: ' + error });
                                        else
                                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                                    }
                                }
                            });
                        }
                        // -------------------------------------------------------------------------------------------
                    })
                }
            }
        })
    } catch (error) {
        console.log('Err total: ' + error);
        if (devMode == true)
            return res.json({ status: "3", content: error + '' });
        else
            return res.json({ status: "3", content: 'Oops, something went wrong' });

    }

});
router.post('/move-new-keyfolder/:key', async function(req, res) {
    let getAppName = (pathFile) => {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(pathFile)) {
                console.log('config');
                fs.readFile(pathFile, 'utf8', function(err, data) {
                    console.log('path: ' + pathFile);
                    if (err) {
                        console.log(err);
                        return reject(err);
                    }
                    parser.parseString(data, function(err, result) {
                        // console.log('parser: ' + JSON.stringify(result))
                        if (err) {
                            console.log(err);
                            return reject(err);
                        }
                        console.log('result: ' + result);
                        var cAppName = result.widget.name[0];
                        console.log('app name 1: ' + cAppName);
                        resolve(cAppName);

                    });

                });
            }
        })
    }
    try {
        var keyFolderUpdate = req.params.key;
        console.log(keyFolderUpdate);
        var typeApp, linkAppDebug, linkAppSigned, typeFolder, pathRootFolder, platforms, sAppName, dbPathRootFolder, status, dateCreate = Date.now();

        if (fs.existsSync(path.join(appRoot, 'public', 'temporary', keyFolderUpdate))) {
            var keyNewFolder = makeid() + md5(Date.now());
            console.log(keyNewFolder);
            fse.copySync(path.join(appRoot, 'public', 'temporary', keyFolderUpdate), path.join(appRoot, 'public', 'temporary', keyNewFolder));

            var folder = fs.readdirSync(path.join(appRoot, 'public', 'temporary', keyNewFolder));
            if (folder.length > 1) {
                console.log('List Folder 1: ' + folder);
                dbPathRootFolder = keyNewFolder;
            } else {
                /////////// Check folder type 2 ////////////////
                var fApp = folder[0];
                console.log('Type Folder 2');
                console.log('List Folder 2: ' + fApp);
                dbPathRootFolder = keyNewFolder + '/' + fApp;
                console.log('dbPath: ' + dbPathRootFolder);
            }
            try {
                console.log(dbPathRootFolder);
                sAppName = await getAppName(path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'config.xml'));
                console.log('App name : ' + sAppName);
            } catch (error) {
                console.log('1: ' + error + '');
                return res.json({ status: "3", content: "Can't get app name" });
            }
            let result = await Infomation.findOne({ keyFolder: keyFolderUpdate }).exec();
            typeApp = result.typeApp;
            typeFolder = result.typeFolder;
            status = 1;
            let infomation = new Infomation({
                keyFolder: keyNewFolder,
                typeApp: typeApp,
                linkAppDebug: '',
                linkAppSigned: '',
                typeFolder: typeFolder,
                pathRootFolder: dbPathRootFolder,
                platforms: '',
                appName: sAppName,
                dateCreate: Date.now(), // moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
                status: 1
            });
            infomation.save((err, kq) => {
                if (err) {
                    console.log('loi: ' + err);
                    if (devMode == true)
                        return res.json({ status: "3", content: err + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
                // console.log('info : ' + Infomation);
                var xml = path.join(appRoot, 'public', 'temporary', dbPathRootFolder, 'www', 'params.xml');
                console.log(xml);
                if (fs.existsSync(xml)) {
                    try {
                        Infomation.update({ keyFolder: keyNewFolder }, { $set: { isParams: true, linkParams: xml, stepBuild: 'uploaded' } }, { upsert: false }, function(err, result) {
                            if (err) {
                                if (devMode == true)
                                    return res.json({ status: "3", content: "Error update data: " + err + '' });
                                else
                                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                            }
                            return res.json({ status: "2", content: "setting-app", keyFolder: keyNewFolder });
                        });
                    } catch (error) {
                        if (devMode == true)
                            return res.json({ status: '3', content: 'Error update data: ' + error + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }

                } else {
                    console.log('2: File params not found');
                    try {
                        Infomation.findOneAndUpdate({ keyFolder: keyNewFolder }, { $set: { isParams: false, stepBuild: 'uploaded' } }, { upsert: false }, function(err, result) {
                            if (err) {
                                if (devMode == true)
                                    return res.json({ status: "3", content: "Error update data: " + err + '' });
                                else
                                    return res.json({ status: "3", content: 'Oops, something went wrong' });
                            }
                            return res.json({ status: "1", content: "platform", keyFolder: keyNewFolder });
                        });
                    } catch (error) {
                        if (devMode == true)
                            return res.json({ status: '3', content: 'Error update data: ' + error });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                }
            });

            // Infomation.findOne({ keyFolder: keyFolderUpdate }).then((data) => {
            //     console.log(data.typeApp);
            //     console.log(data.typeFolder);
            //     console.log(data.pathRootFolder);
            //     console.log(data.appName);
            //     console.log(data.status);
            //     console.log(data.dateCreate);

            // })
            // res.json({ status: '1', content: 'success', keyFolder: keyNewFolder });
        } else {
            res.json({ status: '3', content: 'Your project only exists on the server for 3 days, this project has been deleted, please upload to your other project', keyFolder: keyFolderUpdate });
        }


    } catch (error) {
        console.log(error);
        res.json({ status: '3', content: error + '', keyFolder: keyFolderUpdate });
    }

    // res.redirect('/index');
});


module.exports = router;