const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose');

const app = express();


//map global promise - ger rid of warning(i kinda don t have it)
//mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect('mongodb://localhost/notelist-db', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connect Error'));

//Load Note Model from models/note.js
require('./models/Note');
const Note = mongoose.model('notes');

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//methodoverrride middleware
app.use(methodOverride('_method'));

//index route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});
//about route
app.get('/about', (req, res) => {
  res.render("about");
});
//Note index page
app.get('/notes', (req, res) => {
  Note.find({})
    .sort({ date: 'desc' })
    .then(notes => {
      res.render('notes/index', {
        notes: notes
      });
    });
});

//add note form /notes/add
app.get('/notes/add', (req, res) => {
  res.render("notes/add");
});

//edit note form /notes/add
app.get('/notes/edit/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      res.render('notes/edit', {
        note: note
      });
    });
});
//delete note
app.delete('/notes/:id', (req, res) => {
  Note.remove({
    _id: req.params.id})
    .then(() =>{
      res.redirect('/notes');
    });
});
//Process form
app.post('/notes', (req, res) => {
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
      body: req.body.body
    }
    new Note(newUser)
      .save()
      .then(note => {
        res.redirect('/notes');
      });
  }
});

//edit form process TRY to do this with ajax
app.put('/notes/:id', (req, res) => {
  Note.findOne({
    _id: req.params.id
  })
    .then(note => {
      //new values
      note.title = req.body.title;
      note.body = req.body.body;

      note.save()
      .then(note=>{
        res.redirect('/notes');
      })
    });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});