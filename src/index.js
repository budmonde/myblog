var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');

var renderMd = require('./render-md');

var GLOBALS = require('./config');
var posts = require('../lib/post-meta.json');
var about = {
  id: "about",
  path: './public/markdown/about.md',
} 

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

app.get('/blog', (req, res, next) => {
  Promise.all(posts.map((post) => {
    return renderMd(post);
  })).then((postsData) => {
    res.render('pages/posts', {
      APP_NAME: GLOBALS.APP_NAME,
      active: {
        blog: true,
      },
      body: postsData,
      sidebar: posts,
    });
  }).catch((err) => {
    console.log(err);
    res.send('error');
  });
});

app.get('/blog/:id', (req, res, next) => {
  Promise.all(posts.filter((post) => {
    return post.id === req.params['id'];
  })).then((filteredPosts) => {
    return renderMd(filteredPosts[0]);
  }).then((postData) => {
    res.render('pages/post', {
      APP_NAME: GLOBALS.APP_NAME,
      active: {
        blog: true,
      },
      body: postData,
      sidebar: posts,
    });
  }).catch((err) => {
    console.log(err);
    res.redirect('/404');
  });
});

app.get('/about', (req, res, next) => {
  renderMd(about).then((data) => {
    res.render('pages/post', {
      APP_NAME: GLOBALS.APP_NAME,
      active: {
        about: true,
      },
      body: data,
    });
  }).catch((err) => {
    console.log(err);
    res.redirect('/404');
  });
});

app.get('/portfolio', (req, res, next) => {
  res.render('pages/portfolio', {
    APP_NAME: GLOBALS.APP_NAME,
    items: [
      'photo01',
      'photo02',
      'photo03',
    ],
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
