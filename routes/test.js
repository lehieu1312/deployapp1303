var express = require('express');
var path = require('path');
var fs = require('fs');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var router = express.Router();
var qr = require('qr-image');
var QRCode = require('qrcode');
var spawn = require('child_process').spawn;
var bodyParser = require('body-parser');
var appRoot = require('app-root-path');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var multipart = require('connect-multiparty');
var request = require('request');
var multipartMiddleware = multipart();
var libSetting = require('../lib/setting');
var building = libSetting.totalBuilding;
var hostIOS = libSetting.hostIOS;




router.get('/linkipa', function(req, res) {
    res.render('linkipa');
});
router.get('/getbuilding', function(req, res) {
    console.log(building);
    res.render('index', { title: 'test' });
});
/* GET users listing. */
router.get('/test', function(req, res, next) {
    var hostName = req.headers.host;
    console.log(hostName);
    console.log(req.cookies.nameFolder);
    res.render('error');
});
router.get('/qrcode', function(req, res) {
    var code = qr.image('localhost:3005\static\debug\9f3fec4d9fcaeec15238174e88dd6ac4\zingapp-debug.apk', { type: 'png', ec_level: 'H', size: 20, margin: 0 });
    // res.setHeader('Content-type', 'image/png');
    code.pipe(fs.createWriteStream('./public/qr.png'));
    //code.pipe(res);
    res.render('success', { qr: code })
});
router.get('/qr', function(req, res) {
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        rendererOpts: {
            quality: 0.5
        }
    }
    QRCode.toDataURL('http://localhost/static/debug/6db548f85fd2ee512aa1a83b36abda29/Daily%20news-debug.apk', opts, function(err, url) {
        if (err) throw err
        console.log(url)
            //var img = document.getElementById('image');
            //img.src = url;
        res.render('up', { qrcodeUnsign: url });
    })
});
router.post('/getajax', function(req, res) {
    var name = req.body.number;
    var rule = req.body.rule;
    console.log('rule: ' + rule);
    console.log(name);
    setTimeout(function() { res.send('success'); }, 3000);

    //res.sendFile('/');
});
router.get('/getajax', function(req, res) {
    res.render('ajaxxample');
})

router.get('/send', function(req, res, next) {
    var transporter = nodemailer.createTransport({ // config mail server
        host: 'smtp.gmail.com',
        auth: {
            user: 'lehieu.ggplay@gmail.com',
            pass: '1312199421'
        }
    });
    transporter.use('compile', hbs({
        viewPath: 'views',
        extName: '.ejs'
    }));
    var username = 'le hieu';
    var mail = 'hieu.ric@gmail.com';
    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail

        from: 'Thanh Batmon',
        to: mail,
        subject: 'Test Nodemailer',
        template: 'mail',
        context: {
            username,
            mail
        }

    }
    transporter.sendMail(mainOptions, function(err, info) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            console.log('Message sent: ' + info.response);
            res.redirect('/');
        }
    });
});
router.get('/sendmail', function(req, res) {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'lehieu.ggplay@gmail.com',
            pass: '1312199421'
        }
    });
    let mailOptions = {
        from: '"Taydotech Team 👻" <foo@blurdybloop.com>', // sender address
        to: 'hieu.ric@gmail.com', // list of receivers
        subject: 'app apk ✔', // Subject line
        text: 'Hello world ?', // plain text body
        html: '<b>file app apk</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.render('success');
});

router.get('/getlink', function(req, res, next) {
    var hostName = req.headers.host;
    console.log('host: ' + hostName);
    var linkunsigned = path.join(hostName, 'static', 'debug', 'ae94e0783f356dd0f097e3656cc9755d', 'zingme-debug.apk');
    var linksinged = path.join(hostName, 'static', 'signed', 'ae94e0783f356dd0f097e3656cc9755d', 'zingme.apk');
    console.log(linkunsigned);
    console.log(linksinged);
    res.render('success');
});
router.get('/filexml', function(req, res) {
    var xml = path.join(appRoot.toString(), 'config.xml');
    console.log(xml);
    if (fs.existsSync(xml)) {
        fs.readFile(xml, 'utf8', function(err, data) {
            if (err) {
                console.log(err.message);
                return;

            } else {
                parser.parseString(data, function(err, result) {
                    console.log(result);
                    console.log(result.widget.name[0]);
                    res.render('index');
                });
            }
        });
    } else {
        console.log('not found');
        res.render('index');
    }
});
router.get('/timeout', function(req, res) {
    setTimeout(function() {
        setTimeout(function() {
            res.end('success');
            //console.log('loading...');
        }, 100000);
        //res.render('success');
    }, 150000);

});

router.get('/spawn', function(req, res) {

    var ls = spawn('npm ', ['install'], { encoding: 'utf8' });
    // uncomment the following if you want to see everything returned by the spawnSync command
    // console.log('ls: ' , ls);
    console.log('stdout here: \n' + ls.stdout);
});
router.post('/getrequest', function(req, res) {
    console.log('Đã lấy được thông tin');
    return res.json({ status: '1', content: 'Đã thực hiện xong.' });
});
router.get('/test-request', function(req, res) {
    console.log('123');
    console.log(hostIOS + '/getrequest');
    request.post(hostIOS + '/getrequest', function(err, respone, body) {
        if (err) {
            console.log(err);
        }
        console.log(body)
        res.send('test');
    })
});
router.get('/getxml', function(req, res) {
    var xml = path.join(appRoot.toString(), 'params.xml');
    console.log(xml);
    if (fs.existsSync(xml)) {
        fs.readFile(xml, 'utf8', function(err, data) {
            if (err) {
                console.log(err.message);
                return;

            } else {
                parser.parseString(data, function(err, result) {
                    var arrFile = result['root']['file'];
                    res.render('setting-app', { arrFile });
                });
            }
        });
    } else {
        console.log('not found');
        res.render('index');
    }
});
router.get('/up', function(req, res) {
    res.render('up');
});
router.post('/up', bodyParser, function(req, res, next) {

    try {
        var file = req.files.file_upload;
        console.log(req.body);
        //  sess.appName = req.body.appname;
        console.log(file.size);
        console.log(file.name);
        var appExtFile = file.name.split('.').pop();
        var pathFile = path.join(appRoot, 'public', 'uploads', file.name);

        console.log('pathFile: ' + pathFile);
        res.end('upload success');
        // if (appExtFile == 'zip' && file.size <= 150000000) {
        //     fs.readFile(file.path, function(err, data) {
        //         fs.writeFile(pathFile, data, function(err) {
        //             if (err) console.log(err);
        //             sess.folderAppMd5 = md5(Date.now());
        //             var fileNameUploads = sess.folderAppMd5 + '.' + appExtFile;
        //             // console.log('file uploads: ' + fileNameUploads);
        //             var pathFileUploads = path.join(appRoot, 'public', 'uploads', fileNameUploads);
        //             fs.rename(pathFile, path.join(appRoot, 'public', 'uploads', fileNameUploads), function(err, result) {
        //                 if (err) console.log('ERROR RENAME FILE: ' + err);
        //                 //  else path_FileUploads = path_Uploads + dist + file_NameUploads;
        //                 if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5))) {
        //                     extract(path.join(appRoot, 'public', 'uploads', fileNameUploads), { dir: path.join(appRoot, 'public', 'temporary', sess.folderAppMd5) }, function(err, zipdata) {
        //                         if (err) {
        //                             console.log(err);
        //                             return;
        //                         } else {
        //                             var folder = fs.readdirSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5));
        //                             console.log('folder: ' + folder);

        //                             ////Read folder uploaded
        //                             if (folder.length > 1) {

        //                                 if (!fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'www')) ||
        //                                     !fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'plugins')) ||
        //                                     !fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'resources'))) {
        //                                     return res.render('upload', { errors: 'Not project cordova' });
        //                                 }
        //                                 if(fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'src'))){
        //                                         sess.typeApp=2;
        //                                 }else{
        //                                         sess.typeApp=1;
        //                                 }
        //                                 sess.typeFolder = 1;
        //                                 sess.pathRootFolder = sess.folderAppMd5;
        //                                 var xml = path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www', 'params.xml');
        //                                 console.log(xml);
        //                                 if (fs.existsSync(xml)) {
        //                                     fs.readFile(xml, 'utf8', function(err, data) {
        //                                         if (err) {
        //                                             console.log(err.message);
        //                                             return;
        //                                         } else {
        //                                             parser.parseString(data, function(err, result) {
        //                                                 var arrFile = result['root']['file'];
        //                                                 res.render('info-app', { arrFile });
        //                                             });
        //                                         }
        //                                     });
        //                                 } else {
        //                                     console.log('File params not found');
        //                                     res.render('info-build', { errors: '' });
        //                                 }
        //                             } else {
        //                                 var fApp = folder[0];
        //                                 sess.pathRootFolder = sess.folderAppMd5 + '/' + fApp;
        //                                 if (fs.lstatSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder)).isDirectory() == true) {
        //                                     var folderParent = fs.readdirSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder));
        //                                     if (folderParent.length > 1 && fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www')) &&
        //                                         fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'plugins')) &&
        //                                         fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'resources'))) {
        //                                         sess.typeFolder = 2;
        //                                          if(fs.existsSync(path.join(appRoot, 'public', 'temporary', sess.folderAppMd5, 'src'))){
        //                                         sess.typeApp=2;
        //                                          }else{
        //                                         sess.typeApp=1;
        //                                            }
        //                                         // sess.foderParent = fApp;
        //                                         var xml = path.join(appRoot, 'public', 'temporary', sess.pathRootFolder, 'www', 'params.xml');
        //                                         console.log(xml);
        //                                         if (fs.existsSync(xml)) {
        //                                             fs.readFile(xml, 'utf8', function(err, data) {
        //                                                 if (err) {
        //                                                     console.log(err.message);
        //                                                     return;
        //                                                 } else {
        //                                                     parser.parseString(data, function(err, result) {
        //                                                         var arrFile = result['root']['file'];
        //                                                         res.render('info-app', { arrFile });
        //                                                     });
        //                                                 }
        //                                             });
        //                                         } else {
        //                                             console.log('File params not found');
        //                                             res.render('info-build', { errors: '' });
        //                                         }

        //                                     } else {
        //                                         res.render('upload', { errors: 'File upload not project cordova.' });
        //                                     }

        //                                 } else {
        //                                     res.render('upload', { errors: 'File upload not folder project.' });
        //                                 }


        //                             }


        //                         }
        //                     })
        //                 }
        //             });

        //         });
        //     })
        // } else {
        //     console.log('Format file must "zip" type or size file less than 150MB');
        //     var errors = 'Format file must zip type or size file less than 150MBB';
        //     res.render('upload', { errors: errors });
        //     next();
        // }
    } catch (ex) { res.render('index', { errors: ex + '' }); }
});

module.exports = router;