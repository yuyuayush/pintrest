const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Post'
    }
  ],
  dp: {
    type: String, // Assuming the profile picture is stored as a URL or file path
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

userSchema.plugin(plm);
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;