var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/terms-and-conditions-of-use', function(req, res, next) {
    res.render('terms', { title: 'Terms and Conditions of Use' });
});
router.get('/contact-us', function(req, res, next) {
    res.render('contact-us', { title: 'Contact Us' });
});

router.get('/privacy-policy', function(req, res, next) {
    res.render('privacy-policy', { title: 'Privacy Policy' });
});
router.get('/frequently-asked-questions', function(req, res, next) {
    res.render('faqs', { title: 'FAQs' });
});
router.get('/40x.html', function(req, res, next) {
    res.render('404', { title: 'Page Not Found' });
});
router.get('/50x.html', function(req, res, next) {
    res.render('404', { title: 'Page Not Found' });
});
router.get('/404', function(req, res, next) {
    res.render('404', { title: 'Page Not Found' });
});
router.get('/guide/create-ad-hoc-provision-file', function(req, res, next) {
    res.render('guide-create-ad-hoc-provision', { title: 'Guide Create Ad-Hoc Provisioning Profile' });
});
router.get('/guide/create-app-store-provision-file', function(req, res, next) {
    res.render('guide-create-app-store-provision', { title: 'Guide Create App-Store Provisioning Profile ' });
});
router.get('/guide/create-a-p12-certificate', function(req, res, next) {
    res.render('guide-create-p12-certificate', { title: 'Guide Create a P12 Certificate' });
});
router.get('/guide/register-an-app-id', function(req, res, next) {
    res.render('guide-register-app-id', { title: 'Guide Register an App ID' });
});
router.get('/guide/register-device-for-testing', function(req, res, next) {
    res.render('guide-register-device', { title: 'Guide Register Device For Testing' });
});
router.get('/maintaince', function(req, res, next) {
    res.render('maintaince', { title: 'Maintaince' });
});

module.exports = router;