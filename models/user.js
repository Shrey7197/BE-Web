var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : String,
    password : String,
    type : Number
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);