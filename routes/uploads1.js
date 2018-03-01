var express = require('express');
var extract = require('extract-zip');
var path = require('path'),
    md5 = require('md5'),
    fse = require('fs-extra'),
    multer = require('multer'),
    fs = require('fs'),
    xml2js = require('xml2js'),
    multipart = require('connect-multiparty');
var appRoot = require('app-root-path');

appRoot = appRoot.toString();
var multipartMiddleware = multipart();
var router = express.Router();
var parser = new xml2js.Parser();

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function(req, file, cb) {
        var nameFolder = makeid() + md5(Date.now());
        cb(false, nameFolder)
    }
})

var upload = multer({
    storage: storage,
}).single('file')

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

router.get('/upload', function(req, res) {
    res.render('index', { title: 'Mobile App Builder For iOS and Android' });
});
router.post('/upload', urlencodeParser, function(req, res, next) {
    sess = req.session;
    sess.checked = true;

    // console.log('body: ' + JSON.stringify(req.body));
    // console.log('files: ' + JSON.stringify(req.files));
    try {
        var file = req.files.uploads;
        //  sess.appName = req.body.appname;
        console.log(file.size);
        var appExtFile = file.name.split('.').pop();
        var pathFile = path.join(appRoot, 'public', 'uploads', file.name);

        console.log('pathFile: ' + pathFile);
        if (appExtFile == 'zip' && file.size <= 150000000) {
            fs.readFile(file.path, function(err, data) {
                console.log('read file');
                fs.writeFile(pathFile, data, function(err) {
                    console.log('write file');
                    if (err) {
                        console.log('write file fail: ' + err);
                        return res.json({ status: "3", content: "Error upload file: " + err });
                    }
                    //   res.cookie('folderAppMd5', md5(Date.now()));
                    sess.folderAppMd5 = md5(Date.now());
                    var fileNameUploads = sess.folderAppMd5 + '.' + appExtFile;
                    console.log('file uploads: ' + fileNameUploads);
                    var pathFileUploads = path.join(appRoot, 'public', 'uploads', fileNameUploads);
                    console.log('pathFileUploads : ' + pathFileUploads);
                    fs.rename(pathFile, path.join(appRoot, 'public', 'uploads', fileNameUploads), function(err, result) {
                        if (err) {
                            console.log('ERROR RENAME FILE: ' + err);
                            return res.json({ status: "3", content: "Error rename file: " + err });
                        }
                        console.log('unizip file...');
                        //  else path_FileUploads = path_Uploads + dist + file_NameUploads;
                        if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5))) {
                            extract(path.join(appRoot, 'public', 'uploads', fileNameUploads), { dir: path.join(appRoot, 'public', 'temporary', sess.folderAppMd5) }, function(err, zipdata) {
                                if (err) {
                                    console.log('extract fail: ' + err);
                                    return res.json({ status: "3", content: "Error extract file: " + err });;
                                } else {
                                    var folder = fs.readdirSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
                                    console.log('folder: ' + folder);
                                    ////Read folder uploaded
                                    if (folder.length > 1) {
                                        sess.pathRootFolder = sess.folderAppMd5;
                                        if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'www')) ||
                                            !fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'config.xml'))
                                        ) {
                                            return res.json({ status: "3", content: "File upload not project cordova" }); //res.render('upload', { errors: 'Not project cordova' });
                                        }
                                        if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'src'))) {
                                            if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'ionic.config.json')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'package.json')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'tsconfig.json')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'tslint.json')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'node_modules')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'hooks')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'resources')))
                                                sess.typeApp = 2;
                                            else
                                                return res.json({ status: "3", content: "File(1) upload not project cordova" });
                                        } else {
                                            sess.typeApp = 1;
                                        }
                                        sess.typeFolder = 1;
                                        var xml = path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www', 'params.xml');
                                        console.log(xml);
                                        if (fs.existsSync(xml)) {
                                            fs.readFile(xml, 'utf8', function(err, data) {
                                                if (err) {
                                                    console.log(err.message);
                                                    return res.json({ status: "3", content: "Error(1) read file params.xml:  " + err });
                                                } else {
                                                    parser.parseString(data, function(err, result) {
                                                        res.cookie('arrFile', result['root']['file']);
                                                        // sess.arrFile = result['root']['file'];
                                                        return res.json({ status: "2", content: "settingapp" });
                                                        // res.render('info-app', { arrFile });
                                                    });
                                                }
                                            });
                                        } else {
                                            console.log('1: File params not found');
                                            res.cookie('platform', '1');
                                            return res.json({ status: "1", content: "platform" });
                                            // res.end('infobuild');
                                            // res.render('info-build', { errors: '' });
                                        }
                                    } else {
                                        var fApp = folder[0];
                                        console.log('app type 1: ' + fApp);
                                        sess.pathRootFolder = sess.folderAppMd5 + '/' + fApp;
                                        if (fs.lstatSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder)).isDirectory() == true) {
                                            var folderParent = fs.readdirSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder));
                                            if (folderParent.length > 1 && fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www')) &&
                                                fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'config.xml'))
                                            ) {
                                                sess.typeFolder = 2;
                                                if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'src'))) {
                                                    if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'ionic.config.json')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'package.json')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'tsconfig.json')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'tslint.json')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'node_modules')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'hooks')) &&
                                                        fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'resources')))
                                                        sess.typeApp = 2;
                                                    else
                                                        return res.json({ status: "3", content: "Error(1): File upload not project cordova " });
                                                } else {
                                                    sess.typeApp = 1;
                                                }
                                                // sess.foderParent = fApp;
                                                var xml = path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www', 'params.xml');
                                                console.log(xml);
                                                if (fs.existsSync(xml)) {
                                                    fs.readFile(xml, 'utf8', function(err, data) {
                                                        if (err) {
                                                            console.log('ERR read file params.xml: ' + err);
                                                            return res.json({ status: "3", content: "Error(2): Read file params.xml:  " + err + '' });
                                                        } else {
                                                            parser.parseString(data, function(err, result) {
                                                                res.cookie('arrFile', result['root']['file']);
                                                                // sess.arrFile = result['root']['file'];
                                                                //   res.end('{ "status": "2", "content": "infoapp" }');
                                                                return res.json({ status: "2", content: "setting" });
                                                                //res.render('info-app', { arrFile });
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    console.log('2: File params not found');
                                                    res.cookie('platform', '1');
                                                    return res.json({ status: "1", content: "platform" });
                                                    // res.end('infobuild');
                                                    // res.render('info-build', { errors: '' });
                                                }

                                            } else {
                                                console.log('File(3) upload not project cordova');
                                                return res.json({ status: "3", content: "File(3) upload not project cordova" });
                                                //res.render('upload', { errors: 'File upload not project cordova.' });
                                            }

                                        } else {
                                            console.log('File(4) upload not folder project');
                                            return res.json({ status: "3", content: "File(4) upload not folder project" });
                                            // res.render('upload', { errors: 'File upload not folder project.' });
                                        }
                                    }
                                }
                            })
                        }
                    });
                });
            })
        } else {
            //console.log('Format file must "zip" type or size file less than 150MB');
            console.log('Format file must zip type or size file less than 150MB');
            var errors = 'Format file must zip type or size file less than 150MB';
            return res.json({ status: "3", content: errors });

            //  res.render('upload', { errors: errors });
            // next();
        }
    } catch (ex) {
        console.log('tERR: ' + ex + '');
        return res.render('index', { errors: ex + '' });
    }
});



module.exports = router;