var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var farmerSchema = new mongoose.Schema({
    username : String,
    password : String
});

farmerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Farmer",farmerSchema);