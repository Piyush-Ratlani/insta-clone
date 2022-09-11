const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [{ type: ObjectId, ref: 'User' }], //likes will be an array, with individual item as an ID of user who liked the post
    // building relation between user and post model
    comments: [{ text: String, postedBy: { type: ObjectId, ref: 'User' } }],
    postedBy: {
      type: ObjectId, //this will be the id of user who has created this post
      ref: 'User', //it will refer id from User model
    },
  },
  { timestamps: true }
);

mongoose.model('Post', postSchema);
