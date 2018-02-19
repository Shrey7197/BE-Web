var User   = require("../models/user");
var middlewareObj = {};

middlewareObj.isTechnician = function(req,res,next){
    if(req.isAuthenticated()) {
        User.findByUsername(req.user.username, function(err, foundUser) {
            if(err){
                req.flash("error",err);
                res.redirect("/logintech");
            }
            else {
                if(foundUser.type == 2) {
                    next();
                }
                else {
                    req.flash("error","Login as a Technician to access this page!");
                    res.redirect("logintech");
                }
            }
        });
    }
    else {
        req.flash("error","You need to be logged in as a Technician to access this page!");
        res.redirect("/logintech");
    }
};

middlewareObj.isFarmer = function(req,res,next){
    if(req.isAuthenticated()) {
        User.findByUsername(req.user.username, function(err, foundUser) {
            if(err){
                req.flash("error",err);
                res.redirect("/login");
            }
            else {
                if(foundUser.type == 1) {
                    next();
                }
                else {
                    req.flash("error","Login as a Farmer to access this page!");
                    return res.redirect("/login");
                }
            }
        });
    }
    else {
        req.flash("error","You need to be logged in as a Farmer to access this page!");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;