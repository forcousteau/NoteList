const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load helper
const { ensureAuthenticated } = require('../helpers/auth');

//Load Note Model from models/note.js
require(`../models/Note.js`);
const Note = mongoose.model('notes');

//get note index page
//post render form
router.route('/')
  .get(ensureAuthenticated, (req, res) => {
    Note.find({ user: req.user.id })
      .sort({ date: 'desc' })
      .then(notes => {
        res.render('notes/index', {
          notes: notes
        });
      });
  })
  .post(ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
      errors.push({ text: 'Please add title' });
    }
    if (!req.body.body) {
      errors.push({ text: 'Please add body' });
    }

    if (errors.length > 0) {
      res.render('notes/add', {
        errors: errors,
        title: req.body.title,
        body: req.body.body
      });
    } else {
      const newUser = {
        title: req.body.title,
        body: req.body.body,
        user: req.user.id
      }
      new Note(newUser)
        .save()
        .then(note => {
          req.flash('info_msg', 'Note created');
          res.redirect('/notes');
        });
    }
  });

//add note form /notes/add
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render("notes/add");
});

//edit note form /notes/add
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      if (note.user != req.user.id) {
        req.flash('error_msg', 'Not authorized');
        res.redirect('/notes');
      } else {
        res.render('notes/edit', {
          note: note
        });
      }
    });
});

//edit note form process TODO TRY to do this with ajax
//delete note
router.route('/:id')
  .put(ensureAuthenticated, (req, res) => {
    Note.findOne({
      _id: req.params.id
    })
      .then(note => {
        //new values
        note.title = req.body.title;
        note.body = req.body.body;

        note.save()
          .then(note => {
            req.flash('success_msg', 'Note updated');
            res.redirect('/notes');
          })
      });
  })
  .delete(ensureAuthenticated, (req, res) => {
    Note.remove({
      _id: req.params.id
    })
      .then(() => {
        req.flash('success_msg', 'Note removed');
        res.redirect('/notes');
      });
  });

module.exports = router;