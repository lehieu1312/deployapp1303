var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var User = require('../../models/user');
var md5 = require('md5');
var Base64 = require('js-base64').Base64;

router.get('/forgot/:email', function (req, res) {
    User.findOne({
        verifycode: Base64.decode(req.query.verifycode)
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) {
            res.render('./login/maillforgot', {
                title: 'Send mail reset password'
            });
        } else {
            res.render('./login/resetpass', {
                title: 'Reset Password',
                iduser: Base64.decode(req.query.iduser)
            });
        }
    })

});

router.post("/resetpass/ok", (req, res) => {
    try {
        User.update({
            id: Base64.decode(req.body.iduser)
        }, {
            password: md5(req.body.password)
        }, function (err, data) {
            if (err) {
                console.log(err);
                return res.send({
                    status: "3",
                    message: err + ''
                });
            }
            return res.send({
                status: "1",
                message: "success"
            });
        });
    } catch (error) {
        console.log(error);
        if (devMode == true)
            return res.send({
                status: "3",
                message: error + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });
    }
})

module.exports = router;