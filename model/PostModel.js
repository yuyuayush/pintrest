const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  image:{
    type:String,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  currentDateAndTime: {
    type: Date,
    default: Date.now,
  },
  like:{
        type:Number,
        default:0
      },
      person:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'}
      ],
  check:{
    type:Boolean,
    default:false
  }
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
