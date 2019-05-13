const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User schema
require('../models/User');
const User = mongoose.model('users');

//User login route
router.route('/login')
  .get((req, res) => {
    //add serverside validation
    res.render('users/login');
  })
  .post((req, res, next) => {
    passport.authenticate('local', {
      successRedirect:'/ideas',
      failureRedirect:'/users/login',
      failureFlash: true
    })(req, res, next);
  });

//User register roure
router.route('/register')
  .get((req, res) => {
    res.render('users/register');
  })
  .post((req, res) => {
    let errors = [];
    if (!req.body.name) {
      errors.push({ text: 'Please enter your name' });
    }
    if (!req.body.email) {
      errors.push({ text: 'Please enter your email' });
    }
    if (!req.body.password || !req.body.confpassword) {
      errors.push({ text: 'Please enter password!!!' });
    }
    if (req.body.password != req.body.confpassword) {
      errors.push({ text: 'Passwords must match' });
    }
    if (req.body.password.length < 4) {
      errors.push({ text: 'Password must be at least 4 charecters long' });
    }
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          errors.push({ text: 'Try using a different email' });
          req.flash('error_msg', 'Email already registered, try using differrent');
        }
      });

    if (errors.length > 0) {
      res.render('users/register', {
        errors: errors,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confpassword: req.body.confpassword
      });
    } else {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          new User(newUser)
            .save()
            .then(user => {
              req.flash('success_msg', 'User ' + req.body.name + ' created');
              res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err);
              return;
            })
        });
      });
    }
  });

module.exports = router;