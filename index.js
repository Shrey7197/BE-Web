var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    localStrategy = require("passport-local"),
    User          = require("./models/user");
    
//var url = process.env.DATABASEURL || "mongodb://localhost/agri_drone";
mongoose.connect("mongodb://Shrey:Shrey7!97@ds231658.mlab.com:31658/agridrone");
//mongoose.connect(url);
    
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));


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


//SCHEMA SETUP
var surveySchema = new mongoose.Schema({
    username: String,
    date : String,
    image : String
});

var Survey = mongoose.model("Survey",surveySchema);

// Survey.create(
//     {
//         username : "ganshyamdas",
//         date: "15-01-2018", 
//         image:"https://i.ytimg.com/vi/GmPIh2JLCxo/maxresdefault.jpg"
//     }, function(err,survey){
//         if(err){
//             console.log(err);
//         }
//         else {
//             console.log("Newly created survey");
//             console.log(survey);
//         }
//     }    
// )

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/surveys",function(req,res){
    Survey.find({},function(err,surveys){
        if(err){
            console.log(err);
        }
        else {
            res.render("surveys",{surveys:surveys});
        }
    });
});

app.get("/surveystech",function(req,res){
    res.render("surveystech");
});

app.post("/surveys",function(req,res){
    var username = req.body.username;
    var date = req.body.date;
    var image = req.body.image;
    var newSurvey = {username:username, date:date, image:image}
//    surveys.push(newSurvey);
    Survey.create(newSurvey,function(err,newlyCreated){
        if(err){
            console.log(err);
        }    
        else{
            res.render("/surveys",{username: username});        
        }
    });
});

app.get("/surveys/new",function(req,res){
   res.render("new"); 
});

app.get("/surveys/:id",function(req,res){
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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
           res.redirect("/surveys"); 
        });
    });
});
    
//Show login form
app.get("/login", function(req, res) {
    res.render("login");
});

//Login logic
app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        // Redirect if it fails
        if (!user) { return res.redirect('/login'); }
        User.findByUsername(req.body.username, function(err, foundUser) {
            if(err){
                console.log(err);
            }
            else{
                if(foundUser.type == 1) {
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        // Redirect if it succeeds
                        return res.redirect('/surveys');
                    });
                }
                else {
                    return res.redirect("/login");
                }
            }
        });
    })(req, res, next);
});

//Technician routes
//Show Register Form
app.get("/registertech", function(req, res) {
    res.render("registertech");
});

//Signup logic
app.post("/registertech", function(req,res){
    var newTechnician = new User({username: req.body.username, type:2});
    User.register(newTechnician, req.body.password, function(err,farmer){
        if(err){
            console.log(err);
            return res.render("registertech");
        }
        passport.authenticate("local")(req,res,function(){
           res.redirect("/surveystech"); 
        });
    });
});
    
//Show login form
app.get("/logintech", function(req, res) {
    res.render("logintech");
});

// app.post("/logintech",  passport.authenticate("local", {
//     successRedirect: "/surveystech",
//     failureRedirect: "/logintech"
//     }) , function(req, res) {
//         User.findByUsername(req.body.username, function(err, foundUser) {
//             if(err){
//                 console.log(err);
//             }
//             else{
//                 console.log(foundUser.type);
                
// }})}
// );

//Login logic
app.post('/logintech', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        // Redirect if it fails
        if (!user) { return res.redirect('/logintech'); }
        User.findByUsername(req.body.username, function(err, foundUser) {
            if(err){
                console.log(err);
            }
            else{
                if(foundUser.type == 2) {
                    req.logIn(user, function(err) {
                        if (err) { return next(err); }
                        // Redirect if it succeeds
                        return res.redirect('/surveystech');
                    });
                }
                else {
                    return res.redirect("/logintech");
                }
            }
        });
    })(req, res, next);
});

//LOGOUT ROUTE
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});


app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server has started");
});