let mongoose = require('mongoose');

let trafficChema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    idCustomer: String,
    nameCustomer: String,
    emailCustomer: String,
    phoneNumerCustomer: String,
    addCustomer: String,
    sessionIdUser: String,
    platform: String,
    dateAccess: Date,
    timeAccess: Number,
    dateUpdate: Date,
    dateOutSession: Date,
    pageAccess: [{
        page: String,
        dateAccess: Date,
        timeAccess: Number,
        dateOutSession: Date,
        isHome: Boolean,
    }],
    codeCountry: String,
    country: String,
    status: Boolean
});

let traffic = module.exports = mongoose.model('traffic', trafficChema);