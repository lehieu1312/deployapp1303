let mongoose = require('mongoose');

let ProductStatisticChema = mongoose.Schema({
    idProduct: String,
    idApp: String,
    name: String,
    image: String,
    dateCreate: Date,
    dateAccess: Date,
    timeAccess: Number,
    dateOutSession: Date,
    status: Boolean
});

let ProductStatistic = module.exports = mongoose.model('productstatistics', ProductStatisticChema);