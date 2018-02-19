var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var surveySchema = new mongoose.Schema({
    technicianUsername: String,
    farmerUsername: String,
    date : String,
    image : String
});

var Survey = mongoose.model("Survey",surveySchema);

module.exports = Survey;