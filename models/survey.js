var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

var surveySchema = new mongoose.Schema({
    username: String,
    date : String,
    image : String
});

var Survey = mongoose.model("Survey",surveySchema);

module.exports = Survey;