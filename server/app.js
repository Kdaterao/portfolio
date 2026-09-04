
require('dotenv').config();
//------ imports/settings ------
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');




//----- create express(app) object -----
var app = express();

//------ port ------

app.listen(3000);

//------ view engine setup -----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//----- make our app use our imports/settings -----
app.use(cors({
  origin: true,
  allowedHeaders: ['x-api-key', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//----- add (really basic) authentication -----

const PORTAL_USER = process.env.PORTAL_USER;
const PORTAL_PASSWORD = process.env.PORTAL_PASSWORD;

app.post('/login', function (req, res) {
  const username = req.body && req.body.username;
  const password = req.body && req.body.password;

  if (username === PORTAL_USER && password === PORTAL_PASSWORD) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

function authenticate(req, res, next) {

  if (req.method === 'OPTIONS') return next();

  const key = req.headers['x-api-key'];

  
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  

  next();
}

//----- defines routes -----

var r2 = require('./routes/r2');
var mongo = require('./routes/mongo');



app.use('/r2', authenticate, r2);
app.use('/mongo',authenticate, mongo);

//----- catch 404 and forward to error handler if route not found -----
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500;

  if (req.path.startsWith('/r2') || req.path.startsWith('/mongo')) {
    return res.status(status).json({ error: err.message || 'Internal server error' });
  }

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(status);
  res.render('error');
});

//----- export app(so prob deploys it or sum shi) -----
module.exports = app;
