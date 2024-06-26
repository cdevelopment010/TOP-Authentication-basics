const express = require("express");
const path = require("path"); 
const session = require("express-session"); 
const passport = require("passport"); 
const LocalStrategy = require("passport-local").Strategy; 
const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const mongoDB = "mongourlhere"; 
mongoose.connect(mongoDB); 
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
    "User",
    new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true }
    })
);

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({username: username}); 
            if (!user) {
                return done(null, false, {message: "Incorrect username"});
            }
            if (user.password != password) {
                return done(null, false, {message: "Incorrect password" });
            }
            return done(null, user); 
        } catch(err) {
            return done(err);
        }
    })
)

const app = express();
app.set("views", __dirname);
app.set("view engine", "ejs");

app.use(session({secret: "cats", resave: false, saveUninitialized:true})); 
app.use(passport.session()); 
app.use(express.urlencoded({extended: false })); 

app.get("/", (req, res) => res.render("index")); 
app.get("/sign-up", (req, res) => res.render("sign-up-form"));
app.post("/sign-up", async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        })
        const result = await user.save(); 
        res.redirect("/");
    } catch(err) {
        return next(err);
    }
})

app.listen(3000, () => console.log("app listening on port 3000"));