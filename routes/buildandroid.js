var express = require('express');
var router = express.Router();
var Q = require('q'),
    taydoCommandUtils = require('../lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    path = require('path'),
    fse = require('fs-extra'),
    fs = require('fs'),
    spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync,
    nodemailer = require('nodemailer'),
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    xml2js = require('xml2js'),
    util = require('util'),
    multipart = require('connect-multiparty');
var parser = new xml2js.Parser();
var QRCode = require('qrcode');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multipartMiddleware = multipart();
let Customer = require('../models/customer');
let Infomation = require('../models/infomation');
var listBuilding = require('../models/listbuilding');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var hostServer = libSetting.hostServer;
var sumBuild = libSetting.totalBuilding;

router.get('/build-android/:key', function(req, res) {
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

                    console.log('Go in....');
                    async.each(result, function(kq) {
                        // var mang = kq.keyFolder;
                        linkAppDebug = kq.linkDebug;
                        console.log('link debug app:' + linkAppDebug);
                        linkAppSigned = kq.linkSigned;
                        console.log('link signed app:' + linkAppSigned);
                        sAppName = kq.appName;
                        console.log('sAppName:' + sAppName);
                        cParams = kq.isParams;
                        console.log('cParams:' + cParams);
                        aStep = kq.stepBuild;
                        console.log('aStep:' + aStep);
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
                        if (!fs.existsSync(path.join(appRoot, 'public', 'project', sKeyFolder))) {
                            return res.render('not-folder-app', { title: 'App Not Found' });
                        }
                        if (sPlatform == 'android')
                            res.render('build-android', { sKeyFolder, title: 'Mobile App Builder For iOS and Android Step 4' });
                        else
                            return redirect('/build-ios/' + sKeyFolder);
                        // res.render('build-ios', { sKeyFolder, title: 'Mobile App Builder For iOS and Android Step 4' });

                        // return res.redirect('/infobuild/' + fKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'android') {
                        return res.redirect('/success/' + sKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && sPlatform == 'ios') {
                        return res.redirect('/success-ios/' + sKeyFolder);
                    } else {
                        console.log('Not find info...');
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
router.post('/build-android', multipartMiddleware, async function(req, res, next) {
    // console.log(sess.checked);
    // if (sess.checked == true) {
    var mailCustomer, OU, CN, O, L, ST, C, keystore, keystore_again, alias, sKeyFolder;
    var sTypeApp, sPathRootApp, sAppName;
    //  slinkDebug, slinkSigned;
    // req.check('email', 'Email is required').notEmpty();
    // req.check('email', 'Invalid is email adress').isEmail();
    req.check('keystore', 'Keystore is required').notEmpty();
    req.check('confirmkeystore', 'Confirm keystore does not match the keystore.').equals(req.body.keystore);
    req.check('CN', 'First and last name is required').notEmpty();
    req.check('OU', 'Organizational unit is required').notEmpty();
    req.check('C', 'Organizational is required').notEmpty();
    req.check('L', 'City or location is required').notEmpty();
    req.check('ST', 'State or Province is required').notEmpty();
    req.check('C', 'Two-letter country is required').notEmpty();
    req.check('alias', 'Alias is required').notEmpty();


    ////
    // try {
    //     req.getValidationResult().then(function(result) {
    //         if (!result.isEmpty()) {
    //             return res.json({ status: "2", content: util.inspect(result.array()) });
    //             // res.status(400).send('There have been validation errors: ' + util.inspect(result.array()));
    //             // return;
    //         }
    //         mailCustomer = req.body.email,
    //             OU = req.body.OU,
    //             CN = req.body.CN,
    //             O = req.body.O,
    //             L = req.body.L,
    //             ST = req.body.ST,
    //             C = req.body.C,
    //             keystore = req.body.keystore,
    //             keystore_again = req.body.confirmKeystore,
    //             alias = req.body.alias,
    //             sKeyFolder = req.body.cKeyFolder;


    //         console.log('mail: ' + mailCustomer);


    //     });
    // } catch (error) {
    //     return res.json({ status: '3', content: error + '' });
    // }


    var errors = req.validationErrors(); //req.getValidationResult();
    err = JSON.stringify(errors);
    console.log('errors check: ');
    if (errors) {
        console.log(errors);
        return res.json({ status: "2", content: errors });
    }
    // console.log('123');
    // mailCustomer = req.body.email,
    OU = req.body.OU,
        CN = req.body.CN,
        O = req.body.O,
        L = req.body.L,
        ST = req.body.ST,
        C = req.body.C,
        keystore = req.body.keystore,
        keystore_again = req.body.confirmKeystore,
        alias = req.body.alias,
        sKeyFolder = req.body.cKeyFolder;
    console.log('keystore: ' + keystore);
    console.log('sKeyFolder: ' + sKeyFolder);

    try {
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


    let unZip = (inFile, outFile) => {
        return new Promise((resolve, reject) => {
            extract(inFile, { dir: outFile }, function(err, data) {
                if (err) reject(err);
                else {
                    resolve('extract done...');
                }
            })
        })
    }
    let setCookieFile = (fKeyFolder) => {

        return new Promise(async(resolve, reject) => {
            try {
                let data = await Infomation.findOne({ keyFolder: fKeyFolder }).exec()

                var arrFileUpload = [];
                var itemFileUpload = {
                    fileName: data.appName,
                    dateCreate: moment(data.dateCreateLocal).format('YYYY/MM/DD hh:mm'),
                    sizeFile: data.sizeFileZipUpload,
                    keyFolder: fKeyFolder
                };
                console.log('0');
                if (req.cookies.arrFileUploadedDeployapp) {
                    console.log('1');
                    var arrCk = req.cookies.arrFileUploadedDeployapp;
                    console.log('arrCK 1: ' + JSON.stringify(arrCk));
                    arrCk.push(itemFileUpload);
                    console.log('arrCK 1.1: ' + JSON.stringify(arrCk));
                    res.cookie('arrFileUploadedDeployapp', arrCk, { maxAge: 31536000000, httpOnly: false });
                    console.log('arrFileUploaded 1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                } else {
                    console.log('2');
                    console.log('arrFileUploaded 2: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                    arrFileUpload.push(itemFileUpload);
                    console.log('arrFileUpload: ' + JSON.stringify(arrFileUpload));
                    res.cookie('arrFileUploadedDeployapp', arrFileUpload, { maxAge: 31536000000, httpOnly: false });
                    console.log('arrFileUploaded 2.1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                }
                resolve('success');
            } catch (error) {
                console.log(error);
                reject(error + '');
            }
        })


    }
    let joinProject = (pathProjectApp, pathProjectTemp) => {
        return new Promise((resolve, reject) => {
            try {
                if (sTypeApp == 1) {
                    if (fs.existsSync(path.join(pathProjectApp, 'www'))) fse.removeSync(path.join(pathProjectApp, 'www'));
                    if (fs.existsSync(path.join(pathProjectApp, 'plugins'))) fse.removeSync(path.join(pathProjectApp, 'plugins'));
                    if (fs.existsSync(path.join(pathProjectApp, 'resources'))) fse.removeSync(path.join(pathProjectApp, 'resources'));
                    if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) fse.removeSync(path.join(pathProjectApp, 'config.xml'));
                    // if (fs.existsSync(path.join(pathProjectApp, 'src'))) fse.removeSync(path.join(pathProjectApp, 'src'));

                    if (fs.existsSync(path.join(pathProjectTemp, 'www'))) fse.copySync(path.join(pathProjectTemp, 'www'), path.join(pathProjectApp, 'www'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'plugins'))) fse.copySync(path.join(pathProjectTemp, 'plugins'), path.join(pathProjectApp, 'plugins'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'resources'))) fse.copySync(path.join(pathProjectTemp, 'resources'), path.join(pathProjectApp, 'resources'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'config.xml'))) fse.copySync(path.join(pathProjectTemp, 'config.xml'), path.join(pathProjectApp, 'config.xml'));
                    // if (fs.existsSync(path.join(pathProjectTemp, 'src'))) fse.copySync(path.join(pathProjectTemp, 'src'), path.join(pathProjectApp, 'src'));

                }
                if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) {
                    fs.readFile(path.join(pathProjectApp, 'config.xml'), 'utf8', function(err, data) {
                        if (err) {
                            console.log(err.message);
                            // sess.errors = 'Read config file errors'
                            reject(err); //res.send(sess.errors);
                        } else {
                            parser.parseString(data, function(err, result) {
                                // sess.appName = result.widget.name[0];
                                // console.log('app: ' + sess.appName);
                            });
                        }
                    });
                } else {
                    resolve({ status: "3", content: 'Get not found config.xml' });
                }
                //fse.removeSync(path.join(pathProjectTemp, folderAppMd5));
                // resolve('success.');
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
    let createApp = (appTemp, appProject) => {
        return new Promise((resolve, reject) => {
            try {
                if (sTypeApp == 1) {
                    fse.copySync(path.join(appRoot, 'public', 'appxample', 'ionic1'), path.join(appRoot, 'public', 'project', appProject));
                } else {
                    fse.copySync(path.join(appRoot, 'public', 'temporary', appTemp), path.join(appRoot, 'public', 'project', appProject));
                }
                // fse.renameSync(path.join(appRoot, 'public', 'project', 'myapp'), path.join(appRoot, 'public', 'project', folderApp));
                resolve('success.');
            } catch (error) {
                reject(error);
            }
        });
    }
    let copyFileApkToSign = (pathProjectApp, pathBackupAPK, keyFolder) => {
        return new Promise((resolve, reject) => {
            try {


                var path_outputs = path.join(pathBackupAPK, keyFolder);
                if (!fs.existsSync(path_outputs)) {
                    fs.mkdirSync(path_outputs);
                }
                var path_signed = path.join(pathBackupAPK, keyFolder, 'signed');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk');
                console.log('r: ' + rFile);
                var wFile = path.join(path_signed, 'android-release-unsigned.apk');
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
    let copyFile = (pathFrom, pathTo) => {
        return new Promise((resolve, reject) => {
            try {
                const outAplication = fs.createWriteStream(pathTo);
                fs.createReadStream(pathFrom)
                    .pipe(outAplication);
                outAplication.on("end", resolve("copy success."));
                outAplication.on("error", reject(''));
            } catch (error) {
                console.log(error);
            }
        });
    }

    let copyFileApkDebug = (pathProjectApp, pathBackupAPK, skeyFolder, nApp) => {
        return new Promise((resolve, reject) => {
            try {
                var path_backupapk = path.join(pathBackupAPK, skeyFolder);
                if (!fs.existsSync(path_backupapk)) {
                    fs.mkdirSync(path_backupapk);
                }
                var path_unsigned = path.join(pathBackupAPK, skeyFolder, 'unsigned');
                if (!fs.existsSync(path_unsigned)) {
                    fs.mkdirSync(path_unsigned);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-debug.apk');
                var wFile = path.join(path_unsigned, nApp + '-debug.apk');

                fse.copy(rFile, wFile, { replace: true }, (err) => {
                    if (err) return reject(err + '');
                    resolve('Copy file apk unsign success.');
                });

            } catch (error) {
                reject(error);
            }
        });
    }
    let checkAppCordova = (pathProjectApp) => {
        return checkConfig = fs.existsSync(path.join(pathProjectApp, 'config.xml'));
        // return deferred.promise;
    }
    let generatesKeyStore = (pathBackupAPK, fKeyFolder, CN, OU, O, L, ST, C, keystore, alias) => {

        var deferred = Q.defer();
        var path_signed = path.join(pathBackupAPK, fKeyFolder, 'signed');
        if (!fs.existsSync(path_signed)) {
            fs.mkdirSync(path_signed);
        }
        if (fs.existsSync(path.join(path_signed, 'my-release-key.keystore'))) {
            fs.unlinkSync(path.join(path_signed, 'my-release-key.keystore'));
        }
        const child = spawn('keytool', ['-genkey', '-v', '-dname', '"CN=' + CN + ', OU=' + OU + ', O=' + O + ', L=' + L + ', ST=' + ST + ', C=' + C + '"', '-alias', alias, '-keypass', '"' + keystore + '"', '-keystore', path.join(path_signed, 'my-release-key.keystore'), '-storepass', '"' + keystore + '"', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000'], { stdio: 'inherit', shell: true, silent: true });
        child.on('data', function(data) {
            console.log('data renkey out: ' + data.toString());
        });
        child.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }

    let jarSignerApp = (pathBackupAPK, fKeyFolder, fKeystore, alias) => {

        var deferred = Q.defer();
        const signApp = spawn('jarsigner', ['-verbose', '-sigalg', 'SHA1withRSA', '-digestalg', 'SHA1', '-keystore', path.join(pathBackupAPK, fKeyFolder, 'signed', 'my-release-key.keystore'), '-storepass', '"' + fKeystore + '"', path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'), alias, ], { stdio: 'inherit', shell: true, silent: true });
        signApp.on('data', function(data) {
            console.log('data sign app out: ' + data.toString());
        });
        signApp.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }

    let zipAlignApp = (pathBackupAPK, fKeyFolder, App) => {

        var deferred = Q.defer();
        console.log(path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'));
        console.log(path.join(pathBackupAPK, fKeyFolder, 'signed', App + '.apk'));

        var pathFileZip = path.join(pathBackupAPK, fKeyFolder, 'signed', App + '.apk');
        if (fs.existsSync(pathFileZip)) {
            fs.unlinkSync(pathFileZip)
        }
        const zipalign = spawn('zipalign ', ['-v', '4', path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'), '"' + pathFileZip + '"'], { stdio: 'inherit', shell: true, silent: true });

        zipalign.on('data', function(data) {
            console.log('data zip align app out: ' + data.toString());
        });
        zipalign.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }
    let delProject = (fKeyFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    if (fs.existsSync(path.join(appRoot, 'public', 'uploads', fKeyFolder))) {
                        fse.removeSync(path.join(appRoot, 'public', 'uploads', fKeyFolder));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
                        fse.removeSync(path.join(appRoot, 'public', 'temporary', fKeyFolder));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'project', fKeyFolder))) {
                        fs.chmodSync(path.join(appRoot, 'public', 'project', fKeyFolder), 0777);
                        fse.removeSync(path.join(appRoot, 'public', 'project', fKeyFolder));
                    }
                    resolve('Del project success.');
                } catch (error) {
                    console.log(error);
                    reject(error);
                }

            })

        }
        // keystore, CN, OU, O, L, ST, C, alias
    let genKeyStoreText = (dirWriteFile, fKeyfolder, fKeyStore, fCN, fOU, fO, fL, fST, fC, fAlias) => {
        return new Promise((resolve, reject) => {
            try {
                var pathBackupKey = path.join(dirWriteFile, fKeyfolder);
                if (!fs.existsSync(pathBackupKey)) {
                    fs.mkdirSync(pathBackupKey);
                }
                var pathBackSigned = path.join(dirWriteFile, fKeyfolder, 'signed');
                if (!fs.existsSync(pathBackSigned)) {
                    fs.mkdirSync(pathBackSigned);
                }
                var dataFile = 'Password: ' + fKeyStore + '\r\nFirst and last name: ' + fCN + '\r\nOrganizational unit: ' + fOU + '\r\nOrganizational: ' + fO + '\r\nCity or location: ' + fL + '\r\nState or Province: ' + fST + '\r\nTwo-letter country: ' + fC + '\r\nAlias name: ' + fAlias;
                fs.writeFile(path.join(pathBackSigned, 'keystore.txt'), dataFile, function(err) {
                    if (err) {
                        console.log('err: ' + err);
                        return reject(err);
                    }
                    resolve('Generate file keystore success.');
                })
            } catch (error) {
                console.log(error);
                reject(error);
            }

        })

    }
    let sendLinkMail = (emailReceive, linkAppUnsign, linkAppSigned, App) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({ // config mail server
                host: 'smtp.gmail.com',
                // port:'465',
                auth: {
                    user: 'smtp@taydotech.com',
                    pass: 'deployapp!@#taydotech'
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
                sess.qrcodeUnsign = urlUnsign;
                console.log('Created unSign...');
                QRCode.toDataURL(linkSigned, function(err, urlSigned) {
                    if (err) {
                        console.log('error qr 2');
                        reject(err);
                    }
                    sess.qrcodeSigned = urlSigned;
                    console.log('Created Signed...');
                    resolve('Generate qrcode success.');
                    //   res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                    // res.writeHead(200, { "Content-Type": "application/json" });
                    // res.setHeader("Content-Type", "text/json");
                    // res.setHeader("Access-Control-Allow-Origin", "*");
                    // res.json({success : "Updated Successfully", status : 200});
                    // return res.end({ status: "1", content: "Updated Successfully" });
                })
            })
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


    let taydoCommand = (cmd, args) => {

        //var deferred = Q.defer();
        return new Promise((resolve, reject) => {
            console.log('start cmd');
            try {
                //inherit
                const command = spawnSync(cmd, args, { stdio: 'inherit', shell: true, silent: true, encoding: 'utf-8' });
                //console.log('command: ' + JSON.stringify(command));
                //  console.log('Error: ' + command.Error);
                console.log('output: ' + command.output + '\n');
                // console.log('stdout here: \n' + command.stdout);
                // console.log('stderr here: \n' + command.stderr);
                if (command.status == 1) {
                    return reject(new Error('Error command line'));
                }
                resolve('Command line success');

            } catch (error) {
                return reject(error);
            }

        });
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
    let checkBuilding_1 = (totalBuild) => {
        return new Promise(async(resolve, reject) => {
            var building = await Infomation.find({ appBuilding: 'true' }).count().exec();
            console.log('total: ' + totalBuild);
            console.log('to: ' + building);
            if (building < totalBuild) {
                console.log('checked build 1...');
                resolve('checked building ...');
            } else {
                var checkAppBuilding = setInterval(async function() {

                    building = await Infomation.find({ appBuilding: 'true' }).count().exec();
                    console.log('building: ' + building);
                    if (building < totalBuild) {
                        console.log('checked build 2...');
                        clearInterval(checkAppBuilding);
                        return resolve('checked building...');
                    }
                }, 5000);
            }

        })
    }

    let checkBuilding = (totalBuild, fKeyFolder) => {
        return new Promise(async(resolve, reject) => {
            try {
                let listBuild = new listBuilding({
                    keyFolder: fKeyFolder,
                    platforms: 'android',
                    dateStartBuild: Date.now()
                });
                listBuild.save((err, result) => {
                    if (err) {
                        console.log('err save list build: ' + err);
                        reject(err);
                    }
                    // resolve('Insert building success.');
                    listBuilding.find({ platforms: 'android' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
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
                            listBuilding.find({ platforms: 'android' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
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
        console.log('==================== Build Android App =================');
        console.log('--------------------------------------------------------');
        console.log('Start build android.....');
        // var cmdNpm = 'npm';
        // var argvNpm = ['install', '@ionic/app-scripts@latest', '--save-dev'];
        // process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
        // return commandLine(cmdNpm, argvNpm).then(() => {
        // .then(() => {
        //     var condUpdate = sKeyFolder,
        //         valUpdate = { appBuilding: 'true' };
        //     return updateDB(condUpdate, valUpdate);
        // })
        return checkBuilding(sumBuild, sKeyFolder).then(() => {
                var cmd = 'ionic';
                var argvBuild = ['cordova', 'build', 'android', '--prod'];
                process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
                return commandLine(cmd, argvBuild);
            })
            .then((res) => {
                console.log('Day la ket qua tra ve: ' + res);
                console.log('copy file apk unsign........');
                return copyFileApkDebug(path.join(appRoot, 'public', 'project', sKeyFolder), path.join(appRoot, 'public', 'backupapk'), sKeyFolder, sAppName);
            })
            .then(() => {
                console.log('build project release.....');
                var cmdRelease = 'ionic';
                var argv = ['cordova', 'build', 'android', '--release', '--prod'];
                process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
                return commandLine(cmdRelease, argv);
                // return commandCordova(argv)
            })
            .then(() => {
                console.log('copy  file apk sign....');
                return copyFileApkToSign(path.join(appRoot, 'public', 'project', sKeyFolder), path.join(appRoot, 'public', 'backupapk'), sKeyFolder);
            }).then(() => {
                console.log('generate key.....');
                return generatesKeyStore(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, CN, OU, O, L, ST, C, keystore, alias);
            }).then(() => {
                console.log('=====Generate Keystore file txt=====');
                return genKeyStoreText(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, keystore, CN, OU, O, L, ST, C, alias);
            })
            .then(() => {
                console.log('sign app.....');
                // res.send('Sign app...');
                return jarSignerApp(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, keystore, alias);
            }).then(() => {
                console.log('zip file....');
                console.log(path.join(appRoot, 'public', 'backupapk', sKeyFolder));
                console.log(sAppName);
                return zipAlignApp(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, sAppName);
            })
            .then(() => {
                console.log('=======Setcookie file uploaded=======');
                // process.chdir(path.join(appRoot, 'public', 'project'));
                return setCookieFile(sKeyFolder);
            })
            .then(() => {
                console.log('===Update database===');
                // var hostName = req.headers.host;
                var slinkDebug = path.join('static', 'debug', sKeyFolder, sAppName + '-debug.apk');
                var slinkSigned = path.join('static', 'signed', sKeyFolder, sAppName + '.apk');
                slinkDebug = slinkDebug.replace(/ /g, '%20');
                slinkDebug = slinkDebug.replace("\\", "/");

                slinkSigned = slinkSigned.replace(/ /g, '%20');
                slinkSigned = slinkSigned.replace("\\", "/");

                slinkDebug = hostServer + '/' + slinkDebug;
                slinkSigned = hostServer + '/' + slinkSigned;
                var sLinkKeyStore = hostServer + '/download-keystore/' + sKeyFolder;
                var sLinkKeyStoreText = hostServer + '/download-keystoretxt/' + sKeyFolder;

                var cond = sKeyFolder;
                var value = { linkDebug: slinkDebug, linkSigned: slinkSigned, linkKeyStore: sLinkKeyStore, linkKeyStoretxt: sLinkKeyStoreText, stepBuild: 'builded', buildNewApp: true };
                return updateDB(cond, value);
                // return sendLinkMail(mailCustomer, slinkDebug, slinkSigned, sAppName)
            })
            .then(() => {
                return res.json({ status: "1", content: "Build success.", keyID: sKeyFolder });
            }).catch((ex) => {
                // if (ex instanceof Error) {
                // if (!fs.existsSync(path.join(appRoot, 'lib', 'log_error.txt')))
                //     fs.writeFileSync(path.join(appRoot, 'lib', 'log_error.txt'), Date.now() + '------' + ex);
                // else {
                //     var dataFileLog = fs.readFileSync(path.join(appRoot, 'lib', 'log_error.txt'));
                //     dataFileLog += dataFileLog + '\r\n' + ex;
                //     fs.writeFileSync(path.join(appRoot, 'lib', 'log_error.txt'), Date.now() + '------' + dataFileLog);
                // }
                listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
                    if (err) {
                        if (devMode == true)
                            return res.json({ status: "3", content: err + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    console.log('lỗi: total' + ex + '');
                    Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: ex + '' } }).exec((er, resUpdate) => {
                        if (er) {
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

                //  if (fs.existsSync(path.join(appRoot, 'public', 'project', sess.folderAppMd5))) fs.unlink(path.join(appRoot, 'public', 'project', sess.folderAppMd5))
                // res.render('upload', { errors: 'Error build(' + ex + '' + '),please try again.' });
                //return res.send(ex);
                // }
            });
    } catch (error) {
        listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: error + '' } }).exec((er, resUpdate) => {
                if (er) {
                    if (devMode == true)
                        return res.json({ status: "3", content: er + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
                console.log('Error Fail: ' + error + '');
                if (devMode == true)
                    return res.json({ status: "3", content: error + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            });

        });

    }
    // else {
    //     //checked = true;
    //     res.render('upload', { errors: 'Build fail,please try again' });
    // }
});

router.post('/build-android-update', multipartMiddleware, async function(req, res, next) {
    // console.log(sess.checked);
    // if (sess.checked == true) {
    var mailCustomer, OU, CN, O, L, ST, C, keystore, keystore_again, alias, sKeyFolder, sBuildNewApp;
    var sTypeApp, sPathRootApp, sAppName;
    req.check('cKeyFolder', 'Key Folder is required').notEmpty();
    req.check('keystore_password', 'Keystore password can not be empty ').notEmpty();
    req.check('alias_name', 'Alias name can not be empty').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.json({ status: "2", content: errors });
    }
    var keystoreFileUpdate = req.files.keystore_Update;
    sKeyFolder = req.body.cKeyFolder;
    alias = req.body.alias_name;
    keystore = req.body.keystore_password;
    console.log('alias: ' + alias);
    console.log('keystore: ' + keystore);
    // var typeBuildApp = 1;
    var keyStoreExtFile = keystoreFileUpdate.name.split('.').pop();
    if (keyStoreExtFile != 'keystore') {
        return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.keystore)' });
    } else if (keystoreFileUpdate.size > 5000000) {
        return res.json({ status: "2", content: 'The "' + keystoreFileUpdate.name + '" is too large.Please upload a file less than or equal to 5MB' });
    } else {
        var pathBackupKey = path.join(appRoot, 'public', 'backupapk', sKeyFolder);
        // var path_signed = path.join(pathBackupAPK, fKeyFolder, 'signed');
        if (!fs.existsSync(pathBackupKey)) {
            fs.mkdirSync(pathBackupKey);
        }
        var pathUpload = path.join(appRoot, 'public', 'backupapk', sKeyFolder, 'signed');
        if (!fs.existsSync(pathUpload)) {
            fs.mkdirSync(pathUpload);
        }
        if (fs.existsSync(path.join(pathUpload, 'my-release-key.keystore'))) {
            fs.unlinkSync(path.join(pathUpload, 'my-release-key.keystore'));
        }
        var dataKeystoreFile = fs.readFileSync(keystoreFileUpdate.path);
        fs.writeFileSync(path.join(pathUpload, 'my-release-key.keystore'), dataKeystoreFile);

    }
    try {
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


    let unZip = (inFile, outFile) => {
        return new Promise((resolve, reject) => {
            extract(inFile, { dir: outFile }, function(err, data) {
                if (err) reject(err);
                else {
                    resolve('extract done...');
                }
            })
        })
    }
    let joinProject = (pathProjectApp, pathProjectTemp) => {
        return new Promise((resolve, reject) => {
            try {
                if (sTypeApp == 1) {
                    if (fs.existsSync(path.join(pathProjectApp, 'www'))) fse.removeSync(path.join(pathProjectApp, 'www'));
                    if (fs.existsSync(path.join(pathProjectApp, 'plugins'))) fse.removeSync(path.join(pathProjectApp, 'plugins'));
                    if (fs.existsSync(path.join(pathProjectApp, 'resources'))) fse.removeSync(path.join(pathProjectApp, 'resources'));
                    if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) fse.removeSync(path.join(pathProjectApp, 'config.xml'));
                    // if (fs.existsSync(path.join(pathProjectApp, 'src'))) fse.removeSync(path.join(pathProjectApp, 'src'));

                    if (fs.existsSync(path.join(pathProjectTemp, 'www'))) fse.copySync(path.join(pathProjectTemp, 'www'), path.join(pathProjectApp, 'www'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'plugins'))) fse.copySync(path.join(pathProjectTemp, 'plugins'), path.join(pathProjectApp, 'plugins'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'resources'))) fse.copySync(path.join(pathProjectTemp, 'resources'), path.join(pathProjectApp, 'resources'));
                    if (fs.existsSync(path.join(pathProjectTemp, 'config.xml'))) fse.copySync(path.join(pathProjectTemp, 'config.xml'), path.join(pathProjectApp, 'config.xml'));
                    // if (fs.existsSync(path.join(pathProjectTemp, 'src'))) fse.copySync(path.join(pathProjectTemp, 'src'), path.join(pathProjectApp, 'src'));

                }
                if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) {
                    fs.readFile(path.join(pathProjectApp, 'config.xml'), 'utf8', function(err, data) {
                        if (err) {
                            console.log(err.message);
                            // sess.errors = 'Read config file errors'
                            reject(err); //res.send(sess.errors);
                        } else {
                            parser.parseString(data, function(err, result) {
                                // sess.appName = result.widget.name[0];
                                // console.log('app: ' + sess.appName);
                            });
                        }
                    });
                } else {
                    resolve({ status: "3", content: 'Get not found config.xml' });
                }
                //fse.removeSync(path.join(pathProjectTemp, folderAppMd5));
                // resolve('success.');
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }
    let createApp = (appTemp, appProject) => {
        return new Promise((resolve, reject) => {
            try {
                if (sTypeApp == 1) {
                    fse.copySync(path.join(appRoot, 'public', 'appxample', 'ionic1'), path.join(appRoot, 'public', 'project', appProject));
                } else {
                    fse.copySync(path.join(appRoot, 'public', 'temporary', appTemp), path.join(appRoot, 'public', 'project', appProject));
                }
                // fse.renameSync(path.join(appRoot, 'public', 'project', 'myapp'), path.join(appRoot, 'public', 'project', folderApp));
                resolve('success.');
            } catch (error) {
                reject(error);
            }
        });
    }
    let copyFileApkToSign = (pathProjectApp, pathBackupAPK, keyFolder) => {
        return new Promise((resolve, reject) => {
            try {
                var path_outputs = path.join(pathBackupAPK, keyFolder);
                if (!fs.existsSync(path_outputs)) {
                    fs.mkdirSync(path_outputs);
                }
                var path_signed = path.join(pathBackupAPK, keyFolder, 'signed');
                if (!fs.existsSync(path_signed)) {
                    fs.mkdirSync(path_signed);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk');
                console.log('r: ' + rFile);
                var wFile = path.join(path_signed, 'android-release-unsigned.apk');
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
    let copyFile = (pathFrom, pathTo) => {
        return new Promise((resolve, reject) => {
            try {
                const outAplication = fs.createWriteStream(pathTo);
                fs.createReadStream(pathFrom)
                    .pipe(outAplication);
                outAplication.on("end", resolve("copy success."));
                outAplication.on("error", reject(''));
            } catch (error) {
                console.log(error);
            }
        });
    }
    let copyFileApkDebug = (pathProjectApp, pathBackupAPK, skeyFolder, nApp) => {

        return new Promise((resolve, reject) => {
            try {
                var path_backupapk = path.join(pathBackupAPK, skeyFolder);
                if (!fs.existsSync(path_backupapk)) {
                    fs.mkdirSync(path_backupapk);
                }
                var path_unsigned = path.join(pathBackupAPK, skeyFolder, 'unsigned');
                if (!fs.existsSync(path_unsigned)) {
                    fs.mkdirSync(path_unsigned);
                }
                var rFile = path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-debug.apk');
                var wFile = path.join(path_unsigned, nApp + '-debug.apk');
                // try {
                //     fs.copySync(rFile, wFile)
                //     resolve('Copy file apk unsign success.');
                // } catch (err) {
                //     return reject(err + '');
                // }
                fse.copy(rFile, wFile, { replace: true }, (err) => {
                    if (err) return reject(err + '');
                    resolve('Copy file apk unsign success.');
                });
                // const outProject = fs.createWriteStream(path.join(path_unsigned, sess.appName + '-debug.apk'));
                // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-debug.apk'))
                //     .pipe(outProject);
                // outProject.on("end", resolve("copy success."));
                // outProject.on("error", reject(''));
            } catch (error) {
                reject(error);
            }
        });
    }
    let checkAppCordova = (pathProjectApp) => {
        return checkConfig = fs.existsSync(path.join(pathProjectApp, 'config.xml'));
        // return deferred.promise;
    }
    let generatesKeyStore = (pathBackupAPK, fKeyFolder, CN, OU, O, L, ST, C, keystore, alias) => {

        var deferred = Q.defer();
        var path_signed = path.join(pathBackupAPK, fKeyFolder, 'signed');
        if (!fs.existsSync(path_signed)) {
            fs.mkdirSync(path_signed);
        }
        if (fs.existsSync(path.join(path_signed, 'my-release-key.keystore'))) {
            fs.unlinkSync(path.join(path_signed, 'my-release-key.keystore'));
        }
        const child = spawn('keytool', ['-genkey', '-v', '-dname', '"CN=' + CN + ', OU=' + OU + ', O=' + O + ', L=' + L + ', ST=' + ST + ', C=' + C + '"', '-alias', alias, '-keypass', '"' + keystore + '"', '-keystore', path.join(path_signed, 'my-release-key.keystore'), '-storepass', '"' + keystore + '"', '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000'], { stdio: 'inherit', shell: true, silent: true });
        child.on('data', function(data) {
            console.log('data renkey out: ' + data.toString());
        });
        child.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }
    let jarSignerApp = (pathBackupAPK, fKeyFolder, fnKeyStore, fnAlias) => {

        var deferred = Q.defer();
        const signApp = spawn('jarsigner', ['-verbose', '-sigalg', 'SHA1withRSA', '-digestalg', 'SHA1', '-keystore', path.join(pathBackupAPK, fKeyFolder, 'signed', 'my-release-key.keystore'), '-storepass', '"' + fnKeyStore + '"', path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'), '"' + fnAlias + '"', ], { stdio: 'inherit', shell: true, silent: true });
        signApp.on('data', function(data) {
            console.log('data sign app out: ' + data.toString());
        });
        signApp.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }

    let zipAlignApp = (pathBackupAPK, fKeyFolder, App) => {

        var deferred = Q.defer();
        console.log(path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'));
        console.log(path.join(pathBackupAPK, fKeyFolder, 'signed', App + '.apk'));

        var pathFileZip = path.join(pathBackupAPK, fKeyFolder, 'signed', App + '.apk');
        if (fs.existsSync(pathFileZip)) {
            fs.unlinkSync(pathFileZip)
        }
        const zipalign = spawn('zipalign ', ['-v', '4', path.join(pathBackupAPK, fKeyFolder, 'signed', 'android-release-unsigned.apk'), '"' + pathFileZip + '"'], { stdio: 'inherit', shell: true, silent: true });
        zipalign.on('data', function(data) {
            console.log('data zip align app out: ' + data.toString());
        });
        zipalign.on('close', function(code) {
            if (code > 0) {
                return deferred.reject(code);
            }
            return deferred.resolve();
        });
        return deferred.promise;
    }
    let delProject = (fKeyFolder) => {
        return new Promise((resolve, reject) => {
            try {
                if (fs.existsSync(path.join(appRoot, 'public', 'uploads', fKeyFolder + '.zip'))) {
                    fse.unlinkSync(path.join(appRoot, 'public', 'uploads', fKeyFolder + '.zip'));
                }
                // if (fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
                //     fse.removeSync(path.join(appRoot, 'public', 'temporary', fKeyFolder));
                // }
                if (fs.existsSync(path.join(appRoot, 'public', 'project', fKeyFolder))) {
                    fs.chmodSync(path.join(appRoot, 'public', 'project', fKeyFolder), 0777);
                    fse.removeSync(path.join(appRoot, 'public', 'project', fKeyFolder));
                }
                resolve('Del project success.');
            } catch (error) {
                console.log(error);
                reject(error);
            }

        })

    }
    let sendLinkMail = (emailReceive, linkAppUnsign, linkAppSigned, App) => {
        return new Promise((resolve, reject) => {
            var transporter = nodemailer.createTransport({ // config mail server
                host: 'smtp.gmail.com',
                // port:'465',
                auth: {
                    user: 'smtp@taydotech.com',
                    pass: 'deployapp!@#taydotech'
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
                sess.qrcodeUnsign = urlUnsign;
                console.log('Created unSign...');
                QRCode.toDataURL(linkSigned, function(err, urlSigned) {
                    if (err) {
                        console.log('error qr 2');
                        reject(err);
                    }
                    sess.qrcodeSigned = urlSigned;
                    console.log('Created Signed...');
                    resolve('Generate qrcode success.');
                    //   res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
                    // res.writeHead(200, { "Content-Type": "application/json" });
                    // res.setHeader("Content-Type", "text/json");
                    // res.setHeader("Access-Control-Allow-Origin", "*");
                    // res.json({success : "Updated Successfully", status : 200});
                    // return res.end({ status: "1", content: "Updated Successfully" });
                })
            })
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


    let taydoCommand = (cmd, args) => {

        //var deferred = Q.defer();
        return new Promise((resolve, reject) => {
            console.log('start cmd');
            try {
                //inherit
                const command = spawnSync(cmd, args, { stdio: 'inherit', shell: true, silent: true, encoding: 'utf-8' });
                //console.log('command: ' + JSON.stringify(command));
                //  console.log('Error: ' + command.Error);
                console.log('output: ' + command.output + '\n');
                // console.log('stdout here: \n' + command.stdout);
                // console.log('stderr here: \n' + command.stderr);
                if (command.status == 1) {
                    return reject(new Error('Error command line'));
                }
                resolve('Command line success');

            } catch (error) {
                return reject(error);
            }

        });
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
    let checkBuilding_1 = (totalBuild) => {
        return new Promise(async(resolve, reject) => {
            var building = await Infomation.find({ appBuilding: 'true' }).count().exec();
            console.log('total: ' + totalBuild);
            console.log('to: ' + building);
            if (building < totalBuild) {
                console.log('checked build 1...');
                resolve('checked building ...');
            } else {
                var checkAppBuilding = setInterval(async function() {

                    building = await Infomation.find({ appBuilding: 'true' }).count().exec();
                    console.log('building: ' + building);
                    if (building < totalBuild) {
                        console.log('checked build 2...');
                        clearInterval(checkAppBuilding);
                        return resolve('checked building...');
                    }
                }, 5000);
            }

        })
    }
    let setCookieFile = (fKeyFolder) => {

        return new Promise(async(resolve, reject) => {
            try {
                let data = await Infomation.findOne({ keyFolder: fKeyFolder }).exec()

                var arrFileUpload = [];
                var itemFileUpload = {
                    fileName: data.appName,
                    dateCreate: moment(data.dateCreateLocal).format('YYYY/MM/DD hh:mm'),
                    sizeFile: data.sizeFileZipUpload,
                    keyFolder: fKeyFolder
                };
                console.log('0');
                if (req.cookies.arrFileUploadedDeployapp) {
                    console.log('1');
                    var arrCk = req.cookies.arrFileUploadedDeployapp;
                    console.log('arrCK 1: ' + JSON.stringify(arrCk));
                    arrCk.push(itemFileUpload);
                    console.log('arrCK 1.1: ' + JSON.stringify(arrCk));
                    res.cookie('arrFileUploadedDeployapp', arrCk, { maxAge: 31536000000, httpOnly: false });
                    console.log('arrFileUploaded 1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                } else {
                    console.log('2');
                    console.log('arrFileUploaded 2: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                    arrFileUpload.push(itemFileUpload);
                    console.log('arrFileUpload: ' + JSON.stringify(arrFileUpload));
                    res.cookie('arrFileUploadedDeployapp', arrFileUpload, { maxAge: 31536000000, httpOnly: false });
                    console.log('arrFileUploaded 2.1: ' + JSON.stringify(req.cookies.arrFileUploadedDeployapp));
                }
                resolve('success');
            } catch (error) {
                console.log(error);
                reject(error + '');
            }
        })


    }
    let checkBuilding = (totalBuild, fKeyFolder) => {
        return new Promise(async(resolve, reject) => {
            try {
                let listBuild = new listBuilding({
                    keyFolder: fKeyFolder,
                    platforms: 'android',
                    dateStartBuild: Date.now()
                });
                listBuild.save((err, result) => {
                    if (err) {
                        console.log('err save list build: ' + err);
                        reject(err);
                    }
                    // resolve('Insert building success.');
                    listBuilding.find({ platforms: 'android' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
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
                            listBuilding.find({ platforms: 'android' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
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
        console.log('==================== Build Android App =================');
        console.log('--------------------------------------------------------');
        console.log('Start build android.....');
        // var cmdNpm = 'npm';
        // var argvNpm = ['install', '@ionic/app-scripts@latest', '--save-dev'];
        // process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
        // return commandLine(cmdNpm, argvNpm).then(() => {
        // .then(() => {
        //     var condUpdate = sKeyFolder,
        //         valUpdate = { appBuilding: 'true' };
        //     return updateDB(condUpdate, valUpdate);
        // })
        return checkBuilding(sumBuild, sKeyFolder).then(() => {
                var cmd = 'ionic';
                var argvBuild = ['cordova', 'build', 'android', '--prod'];
                process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
                return commandLine(cmd, argvBuild)
            })
            .then((res) => {
                console.log('Day la ket qua tra ve: ' + res);
                console.log('copy file apk unsign........');
                return copyFileApkDebug(path.join(appRoot, 'public', 'project', sKeyFolder), path.join(appRoot, 'public', 'backupapk'), sKeyFolder, sAppName);
            })
            .then(() => {
                console.log('build project release.....');
                var cmdRelease = 'ionic';
                var argv = ['cordova', 'build', 'android', '--release', '--prod'];
                process.chdir(path.join(appRoot, 'public', 'project', sKeyFolder));
                return commandLine(cmdRelease, argv);
                // return commandCordova(argv)
            })
            .then(() => {
                console.log('copy  file apk sign....');
                return copyFileApkToSign(path.join(appRoot, 'public', 'project', sKeyFolder), path.join(appRoot, 'public', 'backupapk'), sKeyFolder);
            })
            // .then(() => {
            //     console.log('generate key.....');
            //     return generatesKeyStore(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, CN, OU, O, L, ST, C, keystore, alias);
            // })
            .then(() => {
                console.log('sign app.....');
                // res.send('Sign app...');
                return jarSignerApp(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, keystore, alias);
            }).then(() => {
                console.log('zip file....');
                console.log(path.join(appRoot, 'public', 'backupapk', sKeyFolder));
                console.log(sAppName);
                return zipAlignApp(path.join(appRoot, 'public', 'backupapk'), sKeyFolder, sAppName);
            })
            .then(() => {
                console.log('=======Del Project=======');
                // process.chdir(path.join(appRoot, 'public', 'project'));
                return setCookieFile(sKeyFolder);
            })
            .then(() => {
                // var hostName = req.headers.host;
                var slinkDebug = path.join('static', 'debug', sKeyFolder, sAppName + '-debug.apk');
                var slinkSigned = path.join('static', 'signed', sKeyFolder, sAppName + '.apk');
                slinkDebug = slinkDebug.replace(/ /g, '%20');
                slinkDebug = slinkDebug.replace("\\", "/");

                slinkSigned = slinkSigned.replace(/ /g, '%20');
                slinkSigned = slinkSigned.replace("\\", "/");

                slinkDebug = hostServer + '/' + slinkDebug;
                slinkSigned = hostServer + '/' + slinkSigned;
                var sLinkKeyStore = hostServer + '/download-keystore/' + sKeyFolder;
                var cond = sKeyFolder;
                var value = { linkDebug: slinkDebug, linkSigned: slinkSigned, linkKeyStore: sLinkKeyStore, stepBuild: 'builded', buildNewApp: false };
                return updateDB(cond, value);
                // return sendLinkMail(mailCustomer, slinkDebug, slinkSigned, sAppName)
            })
            .then(() => {
                return res.json({ status: "1", content: "Build success.", keyID: sKeyFolder });
            }).catch((ex) => {
                // if (ex instanceof Error) {
                listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
                    if (err) {
                        if (devMode == true)
                            return res.json({ status: "3", content: err + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    console.log('lỗi: total ' + ex + '');
                    Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: ex + '' } }).exec((er, resUpdate) => {
                        if (er) {
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

                //  if (fs.existsSync(path.join(appRoot, 'public', 'project', sess.folderAppMd5))) fs.unlink(path.join(appRoot, 'public', 'project', sess.folderAppMd5))
                // res.render('upload', { errors: 'Error build(' + ex + '' + '),please try again.' });
                //return res.send(ex);
                // }
            });
    } catch (error) {
        listBuilding.remove({ keyFolder: sKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: sKeyFolder }, { $set: { logError: error + '' } }).exec((er, resUpdate) => {
                if (er) {
                    if (devMode == true)
                        return res.json({ status: "3", content: er + '' });
                    else
                        return res.json({ status: "3", content: 'Oops, something went wrong' });
                }
                console.log('Error Fail: ' + error + '');
                if (devMode == true)
                    return res.json({ status: "3", content: error + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            });

        });

    }
    // else {
    //     //checked = true;
    //     res.render('upload', { errors: 'Build fail,please try again' });
    // }
});
module.exports = router;