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

middlewareObj.loginTechnician = function(req,res,next){
    User.findByUsername(req.body.username, function(err, foundUser) {
        if(err){
            req.flash("error",err);
            res.redirect("/logintech");
        }
        else{
            console.log(req.body.username);
            console.log(foundUser);
            if(foundUser.type == 2) {
                req.logIn(foundUser, function(err) {
                    if (err) { return next(err); }
                    req.flash("success","Technician Successfully Logged In! Hello "+foundUser.username+".");
                    return res.redirect('/surveystech');
                });
            }
            else {
                req.flash("error","Farmer's credentials entered. Redirecting to Farmer Login Page");
                return res.redirect("/login");
            }
        }
    });
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


middlewareObj.loginFarmer = function(req,res,next){
    User.findByUsername(req.body.username, function(err, foundUser) {
        if(err){
            req.flash("error","Farmer not found!");
            res.redirect("/login");
        }
        else{
            if(foundUser.type == 1) {
                req.logIn(foundUser, function(err) {
                    if (err) { return next(err); }
                    req.flash("success","Farmer Successfully Logged In! Hello "+foundUser.username);
                    return res.redirect('/surveys');
                });
            }
            else {
                req.flash("error","Technician's credentials entered. Redirecting to Technician Login Page"+".");
                return res.redirect("/logintech");
            }
        }
    });
};

module.exports = middlewareObj;