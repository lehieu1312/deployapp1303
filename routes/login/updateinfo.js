var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var app = express();
var md5 = require('md5');
var User = require('../../models/user');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;

router.get('/updateinf', (req, res) => {
    if (req.session.iduser) {
        User.findOne({
            id: req.session.iduser
        }, (err, result) => {
            // console.log("user update :" + result);
            if (err) {
                console.log(err)
            }
            res.render("./login/updateinf", {
                title: 'updateinf',
                firstname: result.firstname,
                lastname: result.lastname,
                username: result.username,
                email: result.email,
                address: result.address,
                country: result.country
            });
        })
    }
})
router.post('/updateinf/ok', (req, res) => {
    try {
        query_update = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: md5(req.body.password),
            address: req.body.address,
            country: req.body.country,
            zipcode: req.body.zipcode
        }
        User.findOne({
            id: req.session.iduser
        }, function (err, result) {
            if (err) {
                console.log(err);
                if (devMode == true)
                    return res.send({
                        status: "3",
                        message: err + ''
                    });
                else
                    return res.json({
                        status: "3",
                        message: 'Oops, something went wrong'
                    });

            }

            if (!result.username) {
                User.findOne({
                    username: req.body.username
                }, function (err, data) {
                    if (err) {
                        console.log(error);
                        if (devMode == true)
                            return res.send({
                                status: "3",
                                message: err + ''
                            });
                        else
                            return res.json({
                                status: "3",
                                message: 'Oops, something went wrong'
                            });

                    }
                    if (!data) {
                        User.findOne({
                            email: req.body.email
                        }, function (err, result) {
                            if (err) {
                                console.log(err);
                                return res.send({
                                    status: "3",
                                    message: err + ''
                                });
                            }
                            if (!result) {
                                User.update({
                                    id: req.session.iduser
                                }, query_update, function (err, data) {
                                    if (err) {
                                        console.log(err)
                                        return res.send({
                                            status: "3",
                                            message: err + ''
                                        });
                                    };
                                    req.session.fullname = data.firstname + " " + data.lastname;
                                    return res.send({
                                        status: "1",
                                        message: "success"
                                    });
                                });
                            } else {
                                return res.send({
                                    status: "2",
                                    message: "Email already exists"
                                });
                            }
                        })
                    } else {
                        return res.send({
                            status: "2",
                            message: "Username already exists"
                        });
                    }

                })

            } else {
                if (result.username != req.body.username) {
                    return res.send({
                        status: "2",
                        message: "Please enter your username"
                    });
                } else {
                    if (!result.email) {
                        User.findOne({
                            email: req.body.email
                        }, (err, data) => {
                            if (err) {
                                console.log(err);
                                if (devMode == true)
                                    return res.send({
                                        status: "3",
                                        message: err + ''
                                    });
                                else
                                    return res.json({
                                        status: "3",
                                        message: 'Oops, something went wrong'
                                    });
                            }
                            if (data) {
                                return res.send({
                                    status: "2",
                                    message: "email already exists"
                                });
                            } else if (!data) {
                                User.update({
                                    id: req.session.iduser
                                }, query_update, function (err, result) {
                                    if (err) {
                                        console.log(err)
                                        return res.send({
                                            status: "3",
                                            message: err + ''
                                        });

                                    };
                                    req.session.fullname = result.firstname + " " + result.lastname;
                                    // console.log("fullname :" + req.session.fullname);
                                    return res.send({
                                        status: "1",
                                        message: "success"
                                    });
                                });
                            }
                        })
                    } else {
                        if (result.email != req.body.email) {
                            return res.send({
                                status: "2",
                                message: "Please enter your email"
                            });
                        } else {
                            User.update({
                                id: req.session.iduser
                            }, query_update, function (err, result) {
                                if (err) {
                                    console.log(err)
                                    return res.send({
                                        status: "3",
                                        message: err + ''
                                    });
                                };
                                req.session.fullname = result.firstname + " " + result.lastname;
                                // console.log("fullname :" + req.session.fullname);
                                return res.send({
                                    status: "1",
                                    message: "success"
                                });
                            });
                        }
                    }
                }
            }
        })
    } catch (err) {
        console.log(err);
        if (devMode == true)
            return res.send({
                status: "3",
                message: err + ''
            });
        else
            return res.json({
                status: "3",
                message: 'Oops, something went wrong'
            });
    }

})

module.exports = router;