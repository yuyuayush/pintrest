const express = require("express");

const router =express.Router();
const postModel  = require("../model/PostModel");
const UserModel = require("../model/UserModel");

router.post("/delete/:id",async(req,res)=>{
    const id = req.params.id;
    const post = await postModel.findById(id);
    console.log(post);
    try{
        const user  = await UserModel.findOne({email:req.session.username});
        const deleteImage = await postModel.findByIdAndDelete(id);
        let newArray =  user.posts.filter((item => item != post._id));
        user.posts = newArray;
        if(!deleteImage)
            return res.status(404).json({message:"Image not found"});

             return res.redirect("/profile");
    }
    catch(err){
        return res.json(`there is some ${err}`);
    }
        });
        router.post("/like/:id",async(req,res)=>{
            try{

                const id = req.params.id;
                const post = await postModel.findById(id);
                
            if(!post.check){
                post.check=true;
                post.like++;
                const user = await UserModel.find({email:req.session.username});
                post.person.push(user._id);
                post.save();
            }
            else{
                
                post.check=false;
                post.like--;
                const user = await UserModel.find({email:req.session.username});
                post.person.filter((id)=> id != user._id );
                post.save();
            }
            res.status(200).redirect("/");
        }
        catch(err){
            res.send(err);
        }
    })



module.exports = router;
