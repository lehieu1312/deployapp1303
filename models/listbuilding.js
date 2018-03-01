var mongoose = require('mongoose');
let listBuildingChema = mongoose.Schema({
    keyFolder: String,
    platforms: String,
    dateStartBuild: Date
});
let listBuilding = module.exports = mongoose.model('listbuilding', listBuildingChema);