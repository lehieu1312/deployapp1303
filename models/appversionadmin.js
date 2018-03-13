let mongoose = require('mongoose');

let appversionschema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    inforAppversion: [{
        version: String,
        changeLog: String,
        createDate: Date,
        updatedDate: Date,
        nameFile: String,
        isDeployed: Boolean,
        status: Boolean
    }],
    image: String,
    dateCreate: Date,
    status: Boolean
});


let Appversionadmin = module.exports = mongoose.model('appversionadmins', appversionschema);