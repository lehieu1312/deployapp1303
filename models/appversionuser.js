let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let appversionuserschema = mongoose.Schema({
    idApp: String,
    idAppadmin: ObjectId,
    idInforapp: ObjectId,
    versionAdmin: String,
    dateCreate: Date,
    version: String,
    note: String,
    fileApkDebug: String,
    fileApkSigned: String,
    status: Boolean
})
let apversionuser = module.exports = mongoose.model("appversionusers", appversionuserschema)