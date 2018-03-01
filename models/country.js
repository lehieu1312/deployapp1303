let mongoose = require('mongoose');

let countrySchema = mongoose.Schema({
    idcountry: String,
    ISOcode: String,
    countryName: String
});


let Country = module.exports = mongoose.model('countrys', countrySchema);