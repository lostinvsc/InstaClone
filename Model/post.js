const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  img_url: String,
  caption: String,
  username: String,
  create_by: String,
  liked_by: [String],
  comment: [{
comment:String,
comment_by:String
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
