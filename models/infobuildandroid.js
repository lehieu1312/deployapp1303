var mongoose = require('mongoose');

let infoBuildAndroid = mongoose.Schema({
    keyFolder: String,
    bundleIDApp: String,
    keyStore: String,
    alias: String

});

let InfoBuildAndroid = module.exports = mongoose.model('infobuildandroid', infoBuildAndroid);