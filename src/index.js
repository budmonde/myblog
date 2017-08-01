var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');

var GLOBALS = require('./config');


const app = express();


// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views/layouts/'),
  partialsDir: path.join(__dirname, 'views/partials/'),
}));
app.set('view engine', '.hbs');


// set static path for public
app.use(GLOBALS.STATIC_PATH, express.static('public'));


// routes
app.get('/', (req, res, next) => {
  res.redirect('/blog');
});

app.get('/about', (req, res, next) => {
  res.render('pages/about', {
    APP_NAME: GLOBALS.APP_NAME,
    STATIC_PATH: GLOBALS.STATIC_PATH,
    active: {
      about: true,
    },
  });
});

app.get('/blog', (req, res, next) => {
  res.render('pages/blog', {
    APP_NAME: GLOBALS.APP_NAME,
    STATIC_PATH: GLOBALS.STATIC_PATH,
    active: {
      blog: true,
    },
  });
});

app.get('/portfolio', (req, res, next) => {
  res.render('pages/portfolio', {
    APP_NAME: GLOBALS.APP_NAME,
    STATIC_PATH: GLOBALS.STATIC_PATH,
    active: {
      portfolio: true,
    },
  });
});

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err,
  });
});


// port config
app.listen(GLOBALS.WEB_PORT, () => {
  console.log('Server running on port: ' + GLOBALS.WEB_PORT);
});
