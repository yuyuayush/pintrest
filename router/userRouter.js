const express = require("express");
const router =express.Router();
const mongoose = require("mongoose");
const UserModel  = require("../model/UserModel");
const UserPost  = require("../model/PostModel");
const passport = require("passport");
const cookie =require('cookie-parser')

// strategy 
const localStrategy = require("passport-local");
const upload = require("../multer");
const PostModel = require("../model/PostModel");
passport.use(new localStrategy(UserModel.authenticate()));

// router.get("/createuser",async(req,res)=>{
// const createuser = await UserModel.create({
//     username:"ayush" ,
//       password: "19122001an",
//       posts: [],
//       dp: "",
//       email:"ayushnegi1912@gmail.com",
//       fullname: "ayush negi",
// });
// res.send(createuser);

// })
// router.get("/createpost",async(req,res)=>{
// const createpost = await UserPost.create({
//     postText: "Hello everyone this is new here",
//     user:"65a04cd3bd9a4862ca4391c3"
// });
// let user = await UserModel.findOne({_id:"65a04cd3bd9a4862ca4391c3"});
// user.posts.push(createpost._id);
// await user.save();
// res.send(createpost);

// })


// router.get("/alluserPosts",async(req,res)=>{
//     const user = await UserModel.findOne({_id:"65a04cd3bd9a4862ca4391c3"}).populate('posts');
//     res.send(user);
// })
router.get('/',async(req,res)=>{ 
    const post = await PostModel.find();
    const user ={
        id:""
    };
    if(req.session.username)
    user.id = req.session.username;
    res.render("index",{post,user});
})
router.get('/profile',isLogged,async(req,res,next)=>{
    try{
        const user = await UserModel.findOne({email:req.session.username}).populate('posts');
        res.render("profile",{user});
    }
    catch(err){
        res.status(500).send("internal server");
    }
    })

router.post('/register',async(req,res)=>{
    const {username,email,fullname,password}=req.body;
    const userData = new UserModel({
        username,email,fullname,password
    });
    res.cookie({"username": username}); 
    req.session.username =email;
    userData.save();
    // new UserModel({username,email,fullname});
    // UserModel.register(userData,password).then(()=>{
    //     passport.authenticate("local")(req,res,()=>{
    //         res.redirect("/profile");
    //     })
    // })
    res.redirect('/profile');
})
// upload.single("file") is sa send hora ha.
router.post("/upload",upload.single("file"),async(req,res)=>{

    if(!req.file){
        return res.status(404).send("no file ");
    }
    const user = await UserModel.findOne({email:req.session.username});
    const post = await PostModel.create({
        //uploaded file k name; filename k andr hota h 
        image:req.file.filename,
        postText:req.body.figcaption,
        user: user._id
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
})

router.post('/search',async(req,res)=>{
    try{
        const id = req.body.search;
        const reg = new RegExp ('^id','i');
        const post = await PostModel.find({ postText: req } );
        console.log(post);
        res.json(post);
        
    }   
    catch(err){
        res.status(404).json({message:err});
    }
});


router.post('/login',
// passport.authenticate("local",{
//     successRedirect:"/profile",
//     failureRedirect:"/login",
//     failureFlash:true
// }),function(req,res){}
async(req,res)=>{
    const {email,password} = req.body;

    let userobj = await UserModel.findOne({email});
    if(userobj){
        if(password == `${userobj.password}`){
            res.cookie("email",email);
            req.session.username = email;
            res.redirect('/');
        }
        else{
            res.render("login");
        }
    }
    else{
        res.render("login");

    }
}
)

router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err) {return next(err);}
        res.redirect("/");
    });
    // req.session.destroy((err)=>{
    //     if(err) throw err;
    //     res.redirect('/');
    // })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    res.redirect("/");
}

function isLogged(req,res,next){
    if (req.session.username) {
        next();
      } else {
          res.redirect('/login');
      }
}

module.exports = router;
