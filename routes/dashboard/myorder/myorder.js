var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');
var Inforapp = require('../../../models/inforapp');
var orderOfapp = require('../../../models/orderofapp');
var libSetting = require('../../../lib/setting');
var statusPayment = libSetting.statusPayment;

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get("/myorder/:idapp", checkAdmin, (req, res) => {
    try {
        // console.log(statusPayment)
        Inforapp.findOne({
            idApp: req.params.idapp,
            "idUser.idUser": req.session.iduser
        }).then((data) => {
            if (data) {
                orderOfapp.find({
                    idApp: req.params.idapp
                }).then((order) => {
                    // console.log(order)
                    var orderx = [];
                    for (let i = 0; i < order.length; i++) {
                        orderx[i] = {
                            order: order[i],
                            status: statusPayment[order[i].statusOrder]
                        }
                    }
                    appuse = {
                        idApp: req.params.idapp,
                        nameApp: order[0].nameApp
                    }
                    // console.log(orderx)
                    res.render("./dashboard/myorder/myorder", {
                        title: "My Order",
                        myorder: orderx,
                        appuse
                    })
                })
            } else {
                res.redirect("/dashboard/404")
            }
        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

router.post("/changestatuspayment", (req, res) => {
    try {
        console.log(req.body)
        orderOfapp.findOne({
            idApp: req.body.idApp,
            codeOrder: req.body.codeOrder
        }).then(() => {
            orderOfapp.update({
                codeOrder: req.body.codeOrder
            }, {
                statusOrder: req.body.setstatuspaypent
            }, (err, data) => {
                if (err) throw err;
                if (data) {
                    return res.json({
                        status: "1"
                    })
                }
            })
        })

    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})


router.post("/deleteorder", (req, res) => {
    try {
        orderOfapp.findOne({
            idApp: req.body.idApp,
            codeOrder: req.body.codeOrder
        }).then(() => {
            orderOfapp.remove({
                codeOrder: req.body.codeOrder
            }, (err, data) => {
                if (err) throw err;
                return res.json({
                    status: "1",
                    message: req.body.idApp
                })
            })
        })

    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

router.get("/myorder/detail/:idApp", checkAdmin, (req, res) => {
    try {
        console.log(req.params)
        orderOfapp.findOne({
            idApp: req.params.idApp,
            codeOrder: req.query.codeorder
        }, (err, data) => {
            if (err) throw err;
            console.log(data);
            var status = statusPayment[data.statusOrder]
            res.render("./dashboard/myorder/detailorder", {
                title: "Detail Order",
                detailOrder: data,
                status,
                appuse: {
                    idApp: req.params.idApp,
                    nameApp: data.nameApp
                }
            })
        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})


module.exports = router;