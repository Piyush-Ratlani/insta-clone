const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  resetToken: String,
  expireToken: Date,

  // profile pic
  pic: {
    type: String,
    default:
      'https://res.cloudinary.com/piyush27/image/upload/v1616609784/default_dp_ka9krr.jpg',
  },

  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }],
});

mongoose.model('User', userSchema);
