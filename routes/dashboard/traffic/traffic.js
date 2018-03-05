var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var md5 = require('md5');
var async = require('async');
var libSetting = require('../../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var moment = require("moment");
var User = require('../../../models/user');
var Inforapp = require('../../../models/inforapp');
var orderofapp = require('../../../models/orderofapp');
var traffic = require('../../../models/traffic');
var producstatictis = require('../../../models/productstatistic');
var userofapp = require('../../../models/userofapp');
var userstatistic = require('../../../models/userstatistic');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

function filtercustom(a) {
    var b = [];
    while (a.length > 0) {
        let c = a.filter(function (el) {
            return el.pageAccess == a[0].pageAccess
        });
        b.push(c);
        a = a.filter(function (el) {
            return el.pageAccess != a[0].pageAccess
        });
    }
    return b;
}

Array.prototype.sortBy = function (p) {
    return this.slice(0).sort(function (a, b) {
        return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
    });
}

router.get("/traffic/:idApp", checkAdmin, (req, res) => {
    Inforapp.findOne({
        idApp: req.params.idApp,
    }).then((data) => {
        appuse = {
            idApp: req.params.idApp,
            nameApp: data.nameApp
        }
        res.render('./dashboard/traffic/traffic', {
            title: "Traffic",
            appuse,

        })
    })


});

function setday(data, numberdate) {
    var orderstatistic = [
        [],
        []
    ];
    var datenow = new Date();
    datenow = datenow.setHours(0, 0, 0, 0);
    for (let i = 1; i <= numberdate; i++) {
        let getdatax = data.filter(function (el) {
            return el.dateCreate < datenow - 86400000 * (i - 1) &&
                el.dateCreate > datenow - 86400000 * i;
        })
        let getdatay = data.filter(function (el) {
            return el.dateCreate < datenow - 86400000 * (i - 1) &&
                el.dateCreate > datenow - 86400000 * i &&
                el.nameCustomer != "";
        })
        orderstatistic[0][i - 1] = getdatax.length;
        orderstatistic[1][i - 1] = getdatay.length;
    }
    return orderstatistic;
}

router.post("/orderstatistic/:idApp", (req, res) => {
    try {
        orderofapp.find({
            idApp: req.params.idApp
        }).then((data) => {
            var orderstatistic = setday(data, req.query.numberdate);
            return res.json({
                orderstatistic
            });
        })
    } catch (error) {
        console.log(error + "");
    }
})

router.post("/rightnow/:idApp", (req, res) => {
    traffic.find({
        idApp: req.params.idApp,
        // dateOutSession: ""
    }).sort({
        pageAccess: 1
    }).then((data) => {
        let getdata = data.filter(function (el) {
            return !el.dateOutSession;
        });
        let android = getdata.filter(function (el) {
            return el.platform == "android"
        });
        let ios = getdata.filter(function (el) {
            return el.platform == "ios"
        });
        var setpage = filtercustom(getdata);

        var arraypage = [];
        for (let i = 0; i < setpage.length; i++) {
            let page = getdata.filter(function (el) {
                return el.pageAccess == setpage[i][0].pageAccess
            });
            arraypage.push({
                pageAccess: setpage[i][0].pageAccess,
                quantily: page.length
            })
        }

        return res.json({
            android: android.length,
            ios: ios.length,
            page: arraypage.sortBy("quantily")
        });
    })
})

router.post("/pageuser/:idApp", (req, res) => {
    traffic.find({
        idApp: req.params.idApp,
    }).sort({
        pageAccess: 1
    }).then((arraytraffic) => {
        var datenow = new Date();
        var setdatenow = datenow.setHours(0, 0, 0, 0);
        datenow = datenow.setHours(0, 0, 0, 0)
        var getdata;
        if (req.query.numberdate == 0) {
            getdata = arraytraffic.filter(function (el) {
                return el.dateAccess < datenow &&
                    el.dateAccess > setdatenow;
            });
        } else {
            getdata = arraytraffic.filter(function (el) {
                return el.dateAccess < datenow &&
                    el.dateAccess > datenow - 86400000 * req.query.numberdate;
            });
        }
        var setpage = filtercustom(getdata);

        var arraypage = [];
        for (let i = 0; i < setpage.length; i++) {
            let page = getdata.filter(function (el) {
                return el.pageAccess == setpage[i][0].pageAccess
            });
            let accessTime = 0;
            for (let index = 0; index < page.length; index++) {
                accessTime = accessTime + page[index].timeAccess
            }
            arraypage.push({
                pageAccess: setpage[i][0].pageAccess,
                quantily: page.length,
                accessTime: accessTime,
                averageTime: Math.round(accessTime / page.length)
            })
        }
        let datax = arraypage.sortBy("quantily").reverse()
        return res.json({
            pageuser: datax
        })
    })
})

function filterproduc(a) {
    var b = [];
    while (a.length > 0) {
        let c = a.filter(function (el) {
            return el.idProduct == a[0].idProduct
        });
        b.push(c);
        a = a.filter(function (el) {
            return el.idProduct != a[0].idProduct
        });
    }
    return b;
}

router.post("/productstatistic/:idApp", (req, res) => {
    var datenow = new Date();
    var timeend;
    var timestart;
    if (req.query.numberdate == 0) {
        timeend = datenow;
        timestart = datenow.setHours(0, 0, 0, 0);
    } else {
        timeend = datenow.setHours(0, 0, 0, 0);
        timestart = datenow - 86400000 * req.query.numberdate;
    }
    producstatictis.find({
        idApp: req.params.idApp,
        dateCreate: {
            $gte: timestart,
            $lt: timeend
        },
    }).sort({
        idProduct: 1
    }).then((product) => {
        var getproduct = new Array();
        var getproductall = new Array();
        let setdata = filterproduc(product);
        (async function () {
            for (let i = 0; i < setdata.length; i++) {
                let datahihi = await orderofapp.find({
                    idApp: req.params.idApp,
                    dateCreate: {
                        $gte: timestart,
                        $lt: timeend
                    },
                    product: {
                        $elemMatch: {
                            idProduct: setdata[i][0].idProduct
                        }
                    },
                }, {
                    product: {
                        $elemMatch: {
                            idProduct: setdata[i][0].idProduct
                        }
                    },

                }).exec()
                getproduct[i] = datahihi;
            }
            for (let i = 0; i < setdata.length; i++) {
                let datahihi = await orderofapp.find({
                    idApp: req.params.idApp,
                    product: {
                        $elemMatch: {
                            idProduct: setdata[i][0].idProduct
                        }
                    },
                }, {
                    product: {
                        $elemMatch: {
                            idProduct: setdata[i][0].idProduct
                        }
                    },

                }).exec()
                getproductall[i] = datahihi;
            }
            res.json({
                setdata,
                order: getproduct,
                orderall: getproductall
            });
        })()
    })
})

router.post("/useractive/:idApp", (req, res) => {
    var dataday = [];
    var dataweek = [];
    var datamonth = [];
    var datenow = new Date();
    (async function () {
        for (let i = 0; i < req.query.numberdate; i++) {
            var timestart1 = datenow.setHours(0, 0, 0, 0);
            timestart1 = timestart1 - i * 86400000;
            let timeend = timestart1 - 86400000;
            let user1 = await userofapp.find({
                idApp: req.params.idApp,
                dateCreate: {
                    $gte: timeend,
                    $lt: timestart1
                }
            }).exec()
            if (user1.length != 0) {
                dataday[i] = user1.length;
            } else {
                dataday[i] = 0;
            }
        }
        for (let i = 0; i < req.query.numberdate; i++) {
            var timestart2 = datenow.setHours(0, 0, 0, 0);
            timestart2 = timestart2 - i * 86400000;
            let timeend = timestart2 - 86400000 * 7;
            let user2 = await userofapp.find({
                idApp: req.params.idApp,
                dateCreate: {
                    $gte: timeend,
                    $lt: timestart2
                }
            }).exec()
            if (user2.length != 0) {
                dataweek[i] = user2.length;
            } else {
                dataweek[i] = 0;
            }
        }
        for (let i = 0; i < req.query.numberdate; i++) {
            var timestart3 = datenow.setHours(0, 0, 0, 0);
            timestart3 = timestart3 - i * 86400000;
            let timeend = timestart3 - 86400000 * 30;
            let user3 = await userofapp.find({
                idApp: req.params.idApp,
                dateCreate: {
                    $gte: timeend,
                    $lt: timestart3
                }
            }).exec()
            if (user3.length != 0) {
                datamonth[i] = user3.length;
            } else {
                datamonth[i] = 0;
            }
        }
        return await res.json({
            dataday,
            dataweek,
            datamonth
        })
    })()
})

router.post("/userbytime/:idApp", (req, res) => {
    var datenow = new Date();
    var dateend
    if (req.query.numberdate == 0) {
        dateend = datenow.setHours(0, 0, 0, 0) + 86400000;
    }
    if (req.query.numberdate == 1) {
        dateend = datenow.setHours(0, 0, 0, 0)
    }
    if (req.query.numberdate == 7) {
        dateend = datenow.setHours(0, 0, 0, 0)
    }
    if (req.query.numberdate == 30) {
        dateend = datenow.setHours(0, 0, 0, 0) - 86400000 * 30;
    }
    if (req.query.numberdate == 90) {
        dateend = datenow.setHours(0, 0, 0, 0) - 86400000 * 90;
    }
    let getdata = [];
    (async function () {
        for (let i = 0; i < 7; i++) {
            let datestart = dateend - 86400000 * i;
            let setdate = moment(datestart);
            // let getdate = setdate;
            console.log(setdate.format());
            getdata.push([]);
            for (let j = 24; j > 0; j--) {
                // console.log("------------------------")
                // console.log(moment(datestart - j * 3600000))
                // console.log(moment(datestart - (j - 1) * 3600000))
                // console.log("------------------------")
                let userbytime = await userstatistic.find({
                    idApp: req.params.idApp,
                    dateAccess: {
                        $gte: datestart - j * 3600000,
                        $lt: datestart - (j - 1) * 3600000
                    }
                }).exec()
                if (userbytime.length > 0) {
                    getdata[i].push(userbytime.length);
                    console.log(moment(userbytime[0].dateAccess))
                } else {
                    getdata[i].push(0)
                }

            }
        }
        return await res.json(getdata);
    })()
})

function filtertraffic(a) {
    var b = [];
    while (a.length > 0) {
        let c = a.filter(function (el) {
            return el.country == a[0].country
        });
        b.push({
            id: c[0].codeCountry,
            name: c[0].country,
            user: c.length
        });
        a = a.filter(function (el) {
            return el.country != a[0].country
        });
    }
    return b;
}

router.get("/sessioncountry/:idApp", (req, res) => {
    traffic.find({
        idApp: req.params.idApp
    }).then((traffic) => {
        let data = [];
        data = filtertraffic(traffic);
        res.json(
            data.sortBy("user").reverse()
        )
    })
})

module.exports = router;