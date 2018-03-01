let mongoose = require("mongoose");

let userofappschema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    email: String,
    firstName: String,
    lastName: String,
    userName: String,
    address: String,
    city: String,
    zipCode: String,
    company: String,
    phoneNumber: String,
    dateCreate: Date,
    dateUpdate: Date,
    status: Boolean
});

let userofapp = module.exports = mongoose.model('userofapps', userofappschema);