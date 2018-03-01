let mongoose = require('mongoose');

let userChema = mongoose.Schema({
    idApp: String,
    idUser: [{
        idUser: String,
        email: String,
        picture: String,
        dateAdded: Date,
        role: Number,
        status: Boolean
    }],
    nameApp: String,
    onlineCurrent: Number,
    createDate: Date,
    useToday: String,
    useIos: String,
    useAndroid: String,
    status: Boolean
});

let Inforapp = module.exports = mongoose.model('inforapps', userChema);