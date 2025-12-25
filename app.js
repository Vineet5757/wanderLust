if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}




const express = require("express");
const mongoose = require('mongoose');
const app = express();
const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate= require("ejs-mate");
const wrapAsync = require("./utils/warpAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingschema , reviewschema } = require("./schema.js");
const reviews = require("./model/reviews.js");
const listingroutes = require("./routes/listing.js");
const reviewroutes = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const e = require("express");
const flash = require("connect-flash");
const passport = require("passport");
const passportlocal = require("passport-local");
const User = require("./model/user.js");
const Userroutes = require("./routes/user.js"); 



// connect to database  


main()
.then(()=>{console.log("successful")})

.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.AtlasDB_url);

  
}   

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate );
app.use(express.static(path.join(__dirname,'public')));


const store = MongoStore.create({
    mongoUrl: process.env.AtlasDB_url,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});
store.on("error", function(e){
    console.log("session store error", e);
});

const sessionoptions = {
    store: store,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
    }
};

// app.get('/',(req,res)=>{
//     res.send("this is working");
// });


app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentuser = req.user;
    next();
});

// app.get("/demouser", async (req,res)=>{
//     const fakeuser = new User({
//         email:"vineet@example.com",
//             username :"Vineet123",
//     });
//     let registereduser = await User.register(fakeuser,"toshita143");
//     res.send(registereduser);
//    }); 

// middleware for validating listing and review in sever side



 

app.use('/',listingroutes);
app.use('/',reviewroutes);  
app.use('/',Userroutes);




// handling all other routes
 app.all(/.*/,(req,res,next)=>{
    if(!req.originalUrl.startsWith("/listings")){
         res.redirect("/listings");
    }
    else{
        next(new ExpressError("Page Not Found",404));   
    }
  
});  




// error handling middleware

app.use((err, req, res, next) => {
    const { statusCode=500 , message="Something went wrong" } = err;
    res.render("listings/error", { err });
});

app.listen(8080, () => {
    console.log("this port is listening");
});