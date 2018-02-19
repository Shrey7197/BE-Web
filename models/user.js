var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
    username : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    type : Number
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User",userSchema);