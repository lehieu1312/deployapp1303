let mongoose = require('mongoose');

let statisticChema = mongoose.Schema({
    uploaded: Number,
    deployed: Number,
    register: Number,

});

let Statistic = module.exports = mongoose.model('statistic', statisticChema);