const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization ==> Bearer hfgfdlsjhldgffg
  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in...' });
  }
  const token = authorization.replace('Bearer ', ''); //to get the token we are replacing 'Bearer ' -> '', so we will get the exact token from the string 'Bearer hfgfdlsjhldgffg'
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in...' });
    }

    const { _id } = payload;
    User.findById(_id).then(userdata => {
      req.user = userdata;
      next(); //we put next here instead of outside .then() statement becausse, we are querying our DB to find by _id and this step takes some time and by then next() which was outside .then() runs ad finishes the middleware
    });
  });
};
