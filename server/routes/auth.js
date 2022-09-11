const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET } = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { SENDGRID_API, EMAIL } = require('../config/keys');
// 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

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

// signup
router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'please add all the fields' });
  }
  User.findOne({ email: email }) //in database we find user by property email and value as req.body.email
    .then(savedUser => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: 'user already exist with given email' });
      }

      bcrypt
        .hash(password, 12) //bigger the number more secure the pass word will be
        .then(hashedPassword => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            pic,
          });

          user
            .save()
            .then(user => {
              transporter.sendMail({
                to: user.email,
                from: 'disik85378@art2427.com', //this is verified email from sendgrid
                subject: 'signup success',
                html: '<h1>welcome to Insta-Clone</h1>',
              });
              res.json({ message: 'signedup successfully!' });
            })
            .catch(err => console.log(err));
        });
    })
    .catch(err => console.log(err));
});

// signin
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: 'please add email or password' });
  }
  User.findOne({ email: email })
    .then(savedUser => {
      if (!savedUser) {
        //if savedUser is null then run this
        return res.status(422).json({ error: 'invalid email or password' });
      }
      bcrypt
        .compare(password, savedUser.password) //returns boolean
        .then(doMatch => {
          if (doMatch) {
            // res.json({ message: 'successfully signed in' });
            // jwt.sign({_id:savedUser._id}) -> generating token on the basis of userid
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            // console.log(savedUser);
            const { _id, name, email, followers, following, pic } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following, pic },
            });
          } else {
            return res.status(422).json({ error: 'invalid email or password' });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// reset password
router.post('/reset-password', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    // we get token in the form of hexacode , so we convert it into string
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res
          .status(422)
          .json({ error: `User with given email does not exist.` });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000; // user will be able to reset password upto 1hr(3600000ms) after token generation.
      user.save().then(result => {
        transporter.sendMail({
          to: user.email,
          from: 'disik85378@art2427.com',
          subject: 'password reset',
          html: `
            <p>You requested for password reset</p>
            <h5>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password.</h5>
          `,
        });
        res.json({ message: 'check your email.' });
      });
    });
  });
});

router.post('/new-password', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  })
    .then(user => {
      if (!user) {
        return res.status(422).json({ error: 'try again, session expired' });
      }
      bcrypt.hash(newPassword, 12).then(hashedPassword => {
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then(savedUser => {
          res.json({ message: 'password updated!' });
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
