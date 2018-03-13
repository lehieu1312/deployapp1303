let mongoose = require('mongoose');

let appsettingschema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    idUser: String,
    description: String,
    mailapp: String,
    authHref: String,
    auth: String,
    dateCreate: Date,
    status: Boolean
});


let appsetting = module.exports = mongoose.model('appsettings', appsettingschema);