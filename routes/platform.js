var express = require('express'),
    path = require('path'),
    fse = require('fs-extra'),
    spawn = require('child_process').spawn,
    childProcess = require('child_process'),
    spawnSync = require('child_process').spawnSync,
    spawnPromise = require('child-process-promise').spawn,
    crossSpawnPromise = require('cross-spawn-promise'),
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    xml2js = require('xml2js'),
    bbPromise = require('bluebird'),
    appRoot = require('app-root-path'),
    Q = require('q'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    taydoCommandUtils = require('../lib/taydoCommandutils');
var libSetting = require('../lib/setting');
var devMode = libSetting.devMode;
var sumBuild = libSetting.totalBuilding;


var Infomation = require('../models/infomation');
var listBuilding = require('../models/listbuilding');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var parser = new xml2js.Parser();
appRoot = appRoot.toString();
var router = express.Router();

router.get('/platforms/:fkey', function(req, res) {
    console.log('devMode: ' + libSetting.devMode);
    console.log('devMode 2: ' + devMode);
    try {
        var fKeyFolder = req.params.fkey;
        var cParams, cPlatforms;
        console.log('fkey: ' + fKeyFolder);
        Infomation.find({ keyFolder: fKeyFolder }).exec((err, result) => {
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
                        cParams = kq.isParams;
                        aStep = kq.stepBuild;
                        console.log('aStep:' + aStep);
                        cPlatforms = kq.platforms;

                    });

                    console.log('platform: ' + cPlatforms);
                    if (aStep == 'uploaded' && cParams == true) {
                        // return res.render('info-app', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                        return res.redirect('/setting-app/' + fKeyFolder);
                    } else if (aStep == 'uploaded' && cParams == false) {
                        if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
                            return res.render('not-folder-app', { title: 'App Not Found' });
                        }
                        return res.render('platform', { fKeyFolder, title: 'Mobile App Builder For iOS and Android Step 3' });
                        // return res.redirect('/platform/' + fKeyFolder);
                    } else if (aStep == 'installed') {
                        if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', fKeyFolder))) {
                            return res.render('not-folder-app', { title: 'App Not Found' });
                        }
                        return res.render('platform', { fKeyFolder, title: 'Mobile App Builder For iOS and Android Step 3' });
                        // return res.redirect('/platform/' + fKeyFolder);
                    } else if (aStep == 'addedPlatform') {
                        if (cPlatforms == 'android')
                            return res.redirect('/build-android/' + fKeyFolder);
                        else
                            return res.redirect('/build-ios/' + fKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && cPlatforms == 'android') {
                        return res.redirect('/success/' + fKeyFolder);
                    } else if ((aStep == 'builded' || aStep == 'sendMail') && cPlatforms == 'ios') {
                        return res.redirect('/success-ios/' + fKeyFolder);
                    } else {
                        return res.render('404', { title: 'Page Not Found' });
                    }

                }
                // console.log('params end');
            })
            // res.render('platform', { title: 'Mobile App Builder For iOS and Android' });
    } catch (error) {
        console.log('Get platform: ' + error);
        res.render('error', { error, title: 'Error Data' });
    }

});
router.post('/platforms', urlencodeParser, async function(req, res) {
    var pKeyFolder = req.body.cKeyID;
    var sPlatform = req.body.cPlatform;
    console.log('key: ' + pKeyFolder);
    console.log('platform: ' + sPlatform);
    var sTypeApp, sPathRootApp;
    try {
        console.log('query db...');
        let result = await Infomation.find({ keyFolder: pKeyFolder }).exec();
        console.log('info: ' + result);
        console.log('info 2: ' + JSON.stringify(result));
        console.log('info lenght: ' + result.length);
        if (result.length > 0) {
            async.each(result, function(kq) {
                // var mang = kq.keyFolder;
                sTypeApp = kq.typeApp;
                console.log('type app:' + sTypeApp);
                sPathRootApp = kq.pathRootFolder;
                console.log('root folder:' + sPathRootApp);
            })
        } else {
            return res.render('404', { title: 'Page Not Found' });
        }
    } catch (error) {
        return res.json({ status: '3', content: error });
    }

    // return res.json({ status: '3', content: 'pause' });



    let createApp = (appTemp, appProject, typeApp) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('Create Project...');
                if (fs.existsSync(path.join(appRoot, 'public', 'project', appProject))) {
                    fse.removeSync(path.join(appRoot, 'public', 'project', appProject));
                }
                if (typeApp == 1) {
                    fse.copySync(path.join(appRoot, 'public', 'appxample', 'ionic1'), path.join(appRoot, 'public', 'project', appProject));
                } else {
                    // if (fs.existsSync(path.join(appRoot, 'public', 'temporary', appTemp, 'node_modules'))) {
                    //     fse.removeSync(path.join(appRoot, 'public', 'temporary', appTemp, 'node_modules'));
                    //     console.log('Removed node_modules.');
                    // }
                    fse.copySync(path.join(appRoot, 'public', 'temporary', appTemp), path.join(appRoot, 'public', 'project', appProject));
                }
                resolve('success.');
                l
            } catch (error) {
                return reject(error);
            }
        });
    }
    let joinProject = (pathProjectApp, pathProjectTemp, fPlatforms) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('Join Project...');
                if (sTypeApp == 1) {
                    console.log('Check type app: ' + sTypeApp);
                    var arrFolder = fs.readdirSync(pathProjectTemp);
                    async.each(arrFolder, function(result) {
                        console.log('res: ' + result);
                        if (fs.existsSync(path.join(pathProjectApp, result))) {
                            fse.removeSync(path.join(pathProjectApp, result));
                            fse.copySync(path.join(pathProjectTemp, result), path.join(pathProjectApp, result));
                        } else
                            fse.copySync(path.join(pathProjectTemp, result), path.join(pathProjectApp, result));
                    })

                    // if (fs.existsSync(path.join(pathProjectTemp, 'src'))) fse.copySync(path.join(pathProjectTemp, 'src'), path.join(pathProjectApp, 'src'));
                }
                console.log(fPlatforms);
                if (fPlatforms === 'ios') {
                    console.log('Remove folder node_nodules');
                    if (fs.existsSync(path.join(pathProjectApp, 'node_modules'))) {
                        fse.removeSync(path.join(pathProjectApp, 'node_modules'));
                        console.log('Removed node_modules.');
                    }
                }

                // console.log('pa: ' + path.join(pathProjectApp, 'platforms'));
                if (fs.existsSync(path.join(pathProjectApp, 'platforms'))) {
                    fse.removeSync(path.join(pathProjectApp, 'platforms'));
                }
                if (fs.existsSync(path.join(pathProjectApp, 'config.xml'))) {
                    console.log('config');
                    fs.readFile(path.join(pathProjectApp, 'config.xml'), 'utf8', function(err, data) {
                        if (err) {
                            console.log(err);
                            return reject(err); //res.send(sess.errors);
                        }
                        parser.parseString(data, async function(err, result) {
                            // console.log('parser: ' + JSON.stringify(result))
                            if (err) reject(err);
                            var sAppName = result.widget.name[0];
                            var fBundleID = result.widget.$.id;
                            console.log(result.widget.$.id);
                            var fVersionApp = result.widget.$.version;
                            console.log(result.widget.$.version);
                            console.log('App name: ' + sAppName);
                            try {
                                let updateInfo = await Infomation.findOneAndUpdate({ keyFolder: pKeyFolder }, { $set: { appName: sAppName, versionApp: fVersionApp, bundleID: fBundleID } }, { upsert: false });
                            } catch (error) {
                                reject(error);
                            }

                            console.log('3');
                            resolve("Success");
                        });

                    });
                } else {
                    console.log('Errer: check');
                    return reject(new Error("Current working directory is not a Cordova-based project."));
                }
            } catch (error) {
                return reject(error);
            }
        });
    }


    // let spawnCommand = (cmd, args) => {
    //     return new Promise(function(resolve, reject) {
    //         let stdoutData = "";
    //         let stderrData = "";
    //         var spawnCmd = spawn(cmd, args); //{ stdio: 'inherit', shell: true, silent: true
    //         spawnCmd.stdout.on('data', (data) => {
    //             // Edit thomas.g: stdoutData = Buffer.concat([stdoutData, chunk]);
    //             stdoutData += data;
    //             console.log(stdoutData += data);
    //         });

    //         spawnCmd.stderr.on('data', (data) => {
    //             stderrData += data;
    //             console.log(stderrData += data);
    //         });

    //         spawnCmd.on('close', (code) => {
    //             if (stderrData) {
    //                 reject(stderrData);
    //             } else {
    //                 resolve(stdoutData);
    //             }
    //         });
    //         spawnCmd.on('error', (err) => {
    //             reject(err);
    //         });
    //     });
    // }
    function promiseSpawn(cmd, args) {
        return new Promise((resolve, reject) => {
            var info = '';
            try {
                var proc = crossSpawn.spawn(cmd, args);

                proc.stdout.on('data', function(data) {
                    info += data.toString('utf8');
                });

                proc.on('error', function(error) {
                    reject(error);
                });

                proc.on('close', function(code) {
                    if (code !== 0) {
                        reject(code);
                    }
                    resolve(info.replace('\n', ' '));
                });
            } catch (e) {
                reject(e);
            }
        });

    }
    let taydoCommand = (cmd, args) => {
        //var deferred = Q.defer();
        return new Promise((resolve, reject) => {
            console.log('start cmd');
            try {
                //inherit
                const command = spawnSync(cmd, args, { stdio: 'inherit', shell: true, silent: true, encoding: 'utf-8' });
                // console.log('command: ' + JSON.stringify(command));
                //  console.log('Error: ' + command.Error);
                console.log('output: ' + command + '\n');
                // console.log('stdout here: \n' + command.stdout);
                // console.log('stderr here: \n' + command.stderr);
                if (command.status == 1) {
                    return reject(new Error('Error command line.'));
                } else {
                    resolve('Command line success');
                }
            } catch (error) {
                return reject(new Error('Command error: ' + error));
            }

        });
    }

    // crossSpawnPromise
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
                    if (data.toString().toLowerCase().indexOf('err') >= 0) {
                        // console.log(chalk.bold(data.toString()));
                        reject(data);
                    }
                });
                // commandLine.on('error',function(err){
                //     reject(err);
                // });
                commandLine.on('close', function(code) {
                    if (code > 0) {
                        reject(new Error(code));
                    }
                    resolve('Success commandline.');
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }
    let updateDB = (Condition, listArgv) => {
        return new Promise((resolve, reject) => {
            try {
                console.log('This is start update db...');
                Infomation.update({ keyFolder: Condition }, { $set: listArgv }, function(err, result) {
                    if (err) {
                        reject(err);
                    }
                    console.log('Updated db ...');
                    resolve('Update db success.');
                    listBuilding.remove({ keyFolder: Condition }).exec((error, kq) => {
                        if (error) {
                            console.log('Error remove key building: ' + error);
                            reject(error);
                        }

                    });
                });

            } catch (error) {
                console.log(error);
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
                                    console.log('Key check: ' + fKeyFolder);
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
    let fsChmodPathFolder = (pathFolder) => {
            return new Promise((resolve, reject) => {
                try {
                    fs.chmodSync(pathFolder, 0777);
                    resolve('Chmod success.');
                } catch (error) {
                    console.log(error);
                    reject(error);
                }

            })
        }
        // console.log('sumBuild: ' + sumBuild);
        // var building = await Infomation.find({ appBuilding: 'true' }).count().exec();
        // console.log('building 1: ' + building);
        // while (building > sumBuild) {
        //      setInterval(async function() {
        //         console.log('start check app builing');
        //         building = await Infomation.find({ appBuilding: 'true' }).count().exec();
        //         console.log('building 2: ' + building);
        //         // console.log('dem: ' + dem);
        //         // dem--;
        //     }, 3000);
        // }
    try {
        console.log('--------------------------------------------------------');
        console.log('============== Adding Platforms to Project =============');
        console.log('--------------------------------------------------------');
        console.log('Checking Build...');
        return checkBuilding(sumBuild, pKeyFolder).then(() => {
                process.chdir(path.join(appRoot, 'public', 'project'));
                createApp(sPathRootApp, pKeyFolder, sTypeApp)
            }).then(() => {
                console.log('Start Join File.....');
                return joinProject(path.join(appRoot, 'public', 'project', pKeyFolder), path.join(appRoot, 'public', 'temporary', sPathRootApp), sPlatform);
            })
            // .then(() => {
            //     console.log('Access file...');
            //     return fsChmodPathFolder(path.join(appRoot, 'public', 'project', pKeyFolder));
            // })
            .then(function() {
                process.chdir(path.join(appRoot, 'public', 'project', pKeyFolder));
                console.log('Access file...');
                commandLine('chmod', ['-R', '777', './'])
            })
            .then(function() {
                process.chdir(path.join(appRoot, 'public', 'project', pKeyFolder));
                console.log('Start rebuild...');
                return commandLine('npm', ['rebuild', 'node-sass']);
            })
            .then(() => {
                //    console.log('kq: ' + result);

                if (sPlatform == 'android') {
                    console.log('add platform.......');
                    var cmdRelease = 'ionic';
                    var argv;
                    console.log(sPlatform);
                    argv = ['cordova', 'platform', 'add', 'android'];
                    process.chdir(path.join(appRoot, 'public', 'project', pKeyFolder));
                    return commandLine(cmdRelease, argv);
                    // .then(() => {
                    //     console.log('==================NPM install package================');
                    //     process.chdir(path.join(appRoot, 'public', 'project', pKeyFolder));
                    //     return commandLine('npm', ['install']);
                    // });
                }
                //  else {
                //     argv = ['platform', 'add', 'ios'];
                // }

            }).then(() => {
                var cond = pKeyFolder;
                var argrv;
                console.log('start update db...');
                if (sPlatform == 'android') {
                    console.log('add platform android');
                    argrv = { stepBuild: 'addedPlatform', platforms: 'android' };
                } else {
                    console.log('add platform android');
                    argrv = { stepBuild: 'addedPlatform', platforms: 'ios' };
                }
                return updateDB(cond, argrv);
            })
            .then((data) => {
                console.log('a: ' + data);
                return res.json({ status: "1", content: "Success", key: pKeyFolder, platforms: sPlatform });
            }).catch((ex) => {

                console.log('Error total: ' + ex + '');
                listBuilding.remove({ keyFolder: pKeyFolder }, function(err, kq) {
                    if (err) {
                        if (devMode == true)
                            return res.json({ status: "3", content: err + '' });
                        else
                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                    }
                    Infomation.update({ keyFolder: pKeyFolder }, { $set: { logError: ex + '' } }).exec((er, resUpdate) => {
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
                    })

                });

                //  if (fs.existsSync(path.join(appRoot, 'public', 'project', sess.folderAppMd5))) fs.unlink(path.join(appRoot, 'public', 'project', sess.folderAppMd5))
                // res.render('upload', { errors: 'Error build(' + ex + '' + '),please try again.' });
                //return res.send(ex);

            });

    } catch (error) {
        listBuilding.remove({ keyFolder: pKeyFolder }, function(err, kq) {
            if (err) {
                if (devMode == true)
                    return res.json({ status: "3", content: err + '' });
                else
                    return res.json({ status: "3", content: 'Oops, something went wrong' });
            }
            Infomation.update({ keyFolder: pKeyFolder }, { $set: { logError: error + '' } }).exec((er, resUpdate) => {
                if (er) {
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

module.exports = router;