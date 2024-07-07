const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:String,
    name:String,
    username:String,
    password:String,
    photo:String,
    following:[String],
    followers:[String]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
