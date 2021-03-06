var express = require('express');
var path = require('path');
var hbs = require('express-handlebars');

var renderMd = require('./render-md');

const GLOBALS = require('./config');
const about = require('../dist/about-meta.json');
const photos = require('../dist/photos-meta.json');
const posts = require('../dist/posts-meta.json');


const app = express();


// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
  extname: 'hbs',
  partialsDir: path.join(__dirname, 'views/partials/'),
}));
app.set('view engine', '.hbs');


// set static path for public
app.use('/static', express.static('public'));


// routes
app.get('/', (req, res, next) => {
  res.redirect('/blog');
});

app.get('/about', (req, res, next) => {
  renderMd(about).then((data) => {
    res.render('pages/post', {
      APP_NAME: GLOBALS.APP_NAME,
      active: { about: true, },
      body: data,
    });
  }).catch((err) => {
    console.log(err);
    res.send('error');
  });
});

app.get('/blog', (req, res, next) => {
  Promise.all(posts.map((post) => {
    return renderMd(post);
  })).then((postsData) => {
    res.render('pages/posts', {
      APP_NAME: GLOBALS.APP_NAME,
      active: { blog: true, },
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
      active: { blog: true, },
      body: postData,
      sidebar: posts,
    });
  }).catch((err) => {
    console.log(err);
    res.send('error');
  });
});

app.get('/portfolio', (req, res, next) => {
  res.render('pages/portfolio', {
    APP_NAME: GLOBALS.APP_NAME,
    active: { portfolio: true, },
  });
});

app.get('/api/photos', (req, res, next) => {
  amountToSend = 30;
  startOffset = req.query.limit - amountToSend;
  endOffset = Math.min(req.query.limit, photos.length);
  res.send(JSON.stringify(photos.slice(startOffset, endOffset)));
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
    error: err,
    message: err.message,
  });
});


// port config
app.listen(GLOBALS.WEB_PORT, () => {
  console.log('Server running on port: ' + GLOBALS.WEB_PORT);
});
