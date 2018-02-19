var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    User          = require("./models/user"),
    Survey        = require("./models/survey"),
    flash         = require("connect-flash"),
    middleware = require("./middleware");
    
//var url = process.env.DATABASEURL || "mongodb://localhost/agri_drone";
mongoose.connect("mongodb://Shrey:Shrey7!97@ds231658.mlab.com:31658/agridrone");
//mongoose.connect(url);
    
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Pizza rocks!",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/surveys", middleware.isFarmer ,function(req,res){
    Survey.find({"farmerUsername": req.user.username},function(err,surveys){
        if(err){
            console.log(err);
        }
        else {
            res.render("surveys",{surveys:surveys});
        }
    });
});

app.get("/surveystech", middleware.isTechnician ,function(req,res){
    Survey.find({"technicianUsername": req.user.username},function(err,surveys){
        if(err){
            console.log(err);
        }
        else {
            res.render("surveystech",{surveys:surveys});
        }
    });
});

app.post("/surveystech", middleware.isTechnician ,function(req,res){
    var technicianUsername = req.user.username;
    var farmerUsername = req.body.username;
    var date = req.body.date;
    var image = req.body.image;
    var newSurvey = {technicianUsername:technicianUsername, farmerUsername:farmerUsername, date:date, image:image};
//    surveys.push(newSurvey);
    Survey.create(newSurvey,function(err,newlyCreated){
        if(err){
            console.log(err);
        }    
        else{
            req.flash("success","Survey Successfully Added!");
            res.redirect("surveystech");
        }
    });
});

app.get("/surveystech/new", middleware.isTechnician ,function(req,res){
   res.render("new"); 
});

app.get("/surveys/:id", middleware.isFarmer ,function(req,res){
    Survey.findById(req.params.id,function(err,foundSurvey){
        if(err){
            console.log(err);
        } 
       else{
            res.render("show", {survey:foundSurvey});           
       }
    });

});

//AUTHENTICATION ROUTES

//Farmer routes
//Show Register Form
app.get("/register", function(req, res) {
    res.render("register");
});

//Signup logic
app.post("/register", function(req,res){
    var newFarmer = new User({username: req.body.username, type: 1});
    User.register(newFarmer, req.body.password, function(err,farmer){
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Farmer Successfully Signed Up! Hello "+farmer.username+".");
            res.redirect("/surveys"); 
        });
    });
});
    
//Show login form
app.get("/login", function(req, res) {
    res.render("login");
});

//Login logic
app.post('/login', middleware.loginFarmer, function(req, res, next) {
    passport.authenticate('local')(req, res, next);
});

//Technician routes
//Show Register Form
app.get("/registertech", function(req, res) {
    res.render("registertech");
});

//Signup logic
app.post("/registertech", function(req,res){
    var newTechnician = new User({username: req.body.username, type:2});
    User.register(newTechnician, req.body.password, function(err,technician){
        if(err){
            req.flash("error",err);
            res.redirect("registertech");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Successfully Signed Up! Hello "+technician.username+".");
            res.redirect("/surveystech"); 
        });
    });
});
    
//Show login form
app.get("/logintech", function(req, res) {
    res.render("logintech");
});

//Login logic
app.post('/logintech', middleware.loginTechnician, function(req, res, next) {
    passport.authenticate('local')(req, res, next);
});

//LOGOUT ROUTE
app.get("/logout", function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/");
});


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server has started");
});