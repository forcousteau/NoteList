const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//load routes
const notes = require('./routes/notes.js');
const users = require('./routes/users.js');

//passport config
require('./config/passport')(passport);
//DB conf
const db = require('./config/database');
//map global promise - ger rid of warning(i kinda don t have it)
//mongoose.Promise = global.Promise;
//Connect to mongoose
mongoose.connect(db.mongoURI, {
  //useNewUrlParser: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connect Error'));

//Handlebars middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//methodoverrride middleware
app.use(methodOverride('_method'));

//express session middleware
app.use(session({
  secret: 'mommy kissed santa',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Globsl var
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.info_msg = req.flash('info_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

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

//Use routes
app.use('/notes', notes);
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});