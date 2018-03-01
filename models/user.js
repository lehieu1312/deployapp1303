let mongoose = require('mongoose');

let userChema = mongoose.Schema({
    id: String,
    idfb: String,
    idgg: String,
    idtw: String,
    lastname: String,
    firstname: String,
    username: String,
    gender: String,
    birthday: String,
    picture: String,
    agerange: String,
    email: String,
    password: String,
    dateCreate: Date,
    address: String,
    locale: String,
    country: String,
    zipcode: String,
    verifycode: String,
    myapp: [{
        id: String,
        idApp: String,
        nameApp: String,
        status: String
    }],
    status: Boolean
});

let User = module.exports = mongoose.model('users', userChema);