const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//User login roure
router.get('/login', (req, res) => {
  //add serverside validation
  res.render('users/login');
});

//User register roure
router.get('/register', (req, res) => {
  res.send('register');
});

module.exports = router;