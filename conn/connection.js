const mongoose = require('mongoose');
const DB="";
mongoose.connect('mongodb+srv://ayush:19122001an@cluster0.xm7fm.mongodb.net/').then(()=>{
    console.log(`connection sucessed`);
 }).catch((err)=>{
    console.log(`there some error ${err}`);
 })