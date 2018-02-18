var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var technicianSchema = new mongoose.Schema({
    username : String,
    password : String
});

technicianSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Technician",technicianSchema);