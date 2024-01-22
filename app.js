const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');

const passport = require("passport");
const app = express();
const upload = require("./multer");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
require('./conn/connection');
const userRouter = require("./router/userRouter");
const postRouter = require("./router/postRouter");
const cookie = require("cookie-parser");
const flash = require("connect-flash");

app.use(session({
    secret: 'your_secret_key', // Replace with a secret key for session data encryption
    resave: false,
    saveUninitialized: false,
  }));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) { done(null, user) });
passport.deserializeUser(function(user, done) { done(null, user) });

app.use(flash());

const UserModel = require("./model/UserModel");
app.use(userRouter);
app.use(postRouter);
//session 


app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(require('./router/userRouter'));
app.use(require('./router/postRouter'));
// app.use(usersRouter);

app.get("/login",(req,res)=>{
    // res.locals.data = req.flash("error");
    res.render('login');
})

app.get("/register",(req,res)=>{
    res.render('register');
})


app.listen(8000,()=>{
    console.log(`server is running in this 3000 port ${process.env.PORT} `);
})