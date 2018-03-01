var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var stripe = require('stripe')('sk_test_BMc5ii8zIQlNkHImjUlJvwsI');

router.post('/paymentstripe', function (req, res) {
    try {
        console.log("posted");

        // Get the credit card details submitted by the form

        var token = req.body.stripeToken; // Using Express
        var email = req.body.stripeEmail;
        var amount = req.body.amountnew;
        // console.log(req)
        stripe.customers.create({
            source: token,
            email: email
        }).then(function (customer) {
            // console.log(customer)
            return stripe.charges.create({
                amount: amount, // Amount in cents
                currency: "usd",
                receipt_email: email,
                description: 'android box',
                customer: customer.id
            });
        }).then(function (charge) {
            // console.log(charge)
            // YOUR CODE: Save the customer ID and other info in a database for later!
            res.end("ban da mua duoc roi nhe.hihi :)")
        });
    } catch (error) {
        console.log("Loi:" + error);
    }


});

router.get('/stripe', (req, res) => {
    res.render("./checkout/stripe")
})


module.exports = router;