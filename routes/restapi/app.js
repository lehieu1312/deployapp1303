var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/inserttrafficapp', (req, res) => {
    try {
        var idApp = req.query.idapp;
        // var nameApp = req.query.nameapp;
        var platform = req.query.platform;
        var sessionIdUser = req.query.sessionid;
        var dateAccess = Date.now();
        var pageAccess = req.query.page;
        var country = req.query.country;

        if (!idApp || !platform || !sessionIdUser || !pageAccess || !country) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện biến không đủ' });
        } else {
            InforAppModel.findOne({ idApp: idApp }).then((data) => {
                console.log(data);
                if (data) {
                    var trafficData = new TrafficModel({
                        idApp: idApp,
                        nameApp: data.nameApp,
                        sessionIdUser: sessionIdUser,
                        platform: platform,
                        dateAccess: dateAccess,
                        pageAccess: pageAccess,
                        country: country,
                        status: true
                    });
                    trafficData.save((err, kq) => {
                        if (err) {
                            console.log('loi: ' + err);
                            return res.json({ status: "3", msg: err + '' });
                        }
                        var sDateNow = Date.now();
                        TrafficModel.find({ $and: [{ dateAccess: { $gt: sDateNow - (1000 * 60 * 15) } }, { idApp: idApp }] }).count().exec((err, data) => {
                            if (err) {
                                return console.log(err);
                                // return res.render('error', { error: err, title: 'Error Data' });
                            }
                            console.log('data: ' + data);
                            req.io.sockets.emit('server-send-user-online', { idApp: idApp, userOnline: data });
                        });
                        // console.log('đã connect socketio');
                        res.json({ status: 1, msg: 'Thêm thành công bản ghi' });
                    });
                } else {
                    res.json({ status: 2, msg: 'Không tồn tại app trên server.' });
                }
            })
        }
        // currentonline
    } catch (error) {
        console.log(error);
        res.json({ status: 3, msg: 'Lỗi: ' + error + '' });
    }
});

router.post('/insertorderapp', multipartMiddleware, (req, res) => {
    try {
        var idApp, nameApp, idOrder, codeOrder, nameCustomer, email, address, phoneNumber, addressShip, dateCreate, note;
        var discount, feeShip, feeVat, totalMonney, methodPayment, methodOrder, curency, statusOrder, status;
        var idProduct, nameProduct, productCode, size, color, image, price, quantity;

        idApp = req.body.idapp;
        idOrder = req.body.idorder;
        console.log(idOrder);
        res.json({ status: 1, msg: 'idApp: ' + idApp + ' ,idOrder: ' + idOrder });

    } catch (error) {
        console.log(error);
        res.json({ status: 3, msg: 'Lỗi: ' + error + '' });
    }

});
module.exports = router;