var express = require('express');
var router = express.Router();
var libSetting = require('../../lib/setting');
var hostServer = libSetting.hostServer;
var bodyParser = require('body-parser');
var paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ac1YRFBQMzjwaB6QGsMxW_Z321sYjpE7l9ngSQBoaIiTfRWC-ZHH2NKvRxbqKNtNkUi08Xgz7u5IDH5X',
    'client_secret': 'EHdNlc0ANRNjgyOOI3d-0QK5AOP-Y47W7ZqMS-Wvh3afOVHig5VsIlIUPumExqSbM4p5L8rIOMAiLZZB'
});
router.post('/paymentpaypal', function (req, res) {
    var amountnow = req.body.amountnew;
    var create_payment_json = JSON.stringify({
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: hostServer + '/process',
            cancel_url: hostServer + '/cancel',

        },
        transactions: [{
            amount: {
                total: amountnow,
                currency: 'USD'
            },
            description: 'This is the payment transaction description.'
        }]
    });
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log('loi;' + error.response);
            throw error;
        } else {
            for (var index = 0; index < payment.links.length; index++) {
                //Redirect user to this endpoint for redirect url
                if (payment.links[index].rel == 'approval_url') {
                    // console.log(payment.links[index].href);
                    res.redirect(payment.links[index].href)
                }
            }

        }
    });

});

router.get('/process', (req, res) => {
    // console.log(req.query)
    var paymentId = req.query.paymentId;
    var payerId = { payer_id: req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        // console.log(payment)
        if (error) {
            console.error(JSON.stringify(error));
        } else {
            // console.log(JSON.stringify(payment));
            // console.log('-----------------------------------------');
            // console.log(payment.transactions[0].related_resources[0].sale.id);
            if (payment.state == 'approved') {
                paypal.sale.get(payment.transactions[0].related_resources[0].sale.id, (err, data) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                    } else {
                        console.log('--------------------+--------------------');
                        if (data.state == "completed") {
                            res.end("ban da mua duoc roi nhe.hihi :)");
                        } else {
                            res.redirect('/cancel')
                        }
                        console.log(data);
                    }
                })

            } else {
                res.redirect('/cancel');
            }
        }
    })


})
router.get('/cancel', (req, res) => {
    res.end("ban chua mua duoc nhe !");
});

router.get('/paypal', (req, res) => {
    res.render("./checkout/paypal")
})


module.exports = router;