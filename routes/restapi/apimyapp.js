var express = require('express');
var router = express.Router();
var app = express();
var inforapp = require('../../models/inforapp');


router.get('/insertinfoapp', (req, res) => {
    try {
        var app = req.query;
        var idApp = req.query.idApp;
        var onlineCurrent = req.query.onlineCurrent;
        var useToday = req.query.useToday;
        var useIos = req.query.useIos;
        var useAndroid = req.query.useAndroid;
        // console.log(typeof(onlineCurrent));
        if (!idApp) {
            res.send("idApp not exist!");
        } else if (typeof(idApp) != "string") {
            res.send("idApp Sai cu phap!");
        } else if (!onlineCurrent) {
            res.send("onlineCurrent not exist!");
        } else if (typeof(onlineCurrent) != "string") {
            res.send("onlineCurrent Sai cu phap!");
        } else if (!useToday) {
            res.send("usetoday not exist!");
        } else if (typeof(useToday) != "string") {
            res.send("usetoday Sai cu phap!");
        } else if (!useIos) {
            res.send("useIos not exist!");
        } else if (typeof(useIos) != "string") {
            res.send("useIos Sai cu phap!");
        } else if (!useAndroid) {
            res.send("useAndroid not exist!");
        } else if (typeof(useAndroid) != "string") {
            res.send("useAndroid Sai cu phap!");
        } else {
            inforapp.findOne({ idApp: app.idApp }, (err, data) => {
                if (err) {
                    console.log(err);
                }
                if (!data) {
                    res.json("app not exist");
                }
                if (data) {
                    inforapp.update({ idApp: app.idApp }, app, (err, result) => {
                        res.json("infor app updated");
                    });
                }
            })
        }
    } catch (error) {
        console.log('loi: ' + error);
        return res.send({ message: error + '' });
    }
})



module.exports = router;