const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost/notelist-db', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connect Error'));

//Load Note Model from models/note.js
require('./models/note');
const Note = mongoose.model('notes');

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

//add note form /notes/add
app.get('/notes/add', (req, res) => {
  res.render("notes/add");
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
    res.send('ok');
  }
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});