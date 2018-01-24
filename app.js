var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var editorController = require('./routes/editor_controller');
// var users = require('./routes/users');
// database
var Datastore = require('nedb');
var db = new Datastore({ filename: './dbs/educatedangles' });
var eventdb = new Datastore({ filename: './dbs/events' });
eventdb.loadDatabase();
var photosdb = new Datastore({ filename: './dbs/photos' });
photosdb.loadDatabase();
// db.loadDatabase(function (err) {    // Callback is optional
//   // Now commands will be executed
// });
db.loadDatabase(function (err) { 
  // def req fields
  var reqFields = [
    {
      title: 'discription',
      type: 'text'
    },
    {
      title: 'call_to_action',
      type: 'text'
    },
    {
      title: 'story1',
      type: 'fullHTML'
    },
    {
      title: 'side_bar',
      type: 'fullHTML'
    },
    {
      title: 'story2',
      type: 'fullHTML'
    },
    {
      title: 'side_bar2',
      type: 'fullHTML'
    },
    {
      title: 'story3',
      type: 'fullHTML'
    },
    {
      title: 'side_bar3',
      type: 'fullHTML'
    }
  ];
  // check for req fields and add them if needed
  reqFields.map(function (field, i) {
    db.find({ title: field.title }, function (err, docs) {
      if (docs.length < 1) {
        db.insert(field);
      }
    });
    db.find({ title: field.title }, function (err, docs) {
      docs[0].order = i + 2;
      db.update({ title: field.title }, docs[0]);
    });
  });
});

// var attachDB = function (req, res, next) {
//   req.db = db;
//   next();
// };
var attachDB = function (name, dbOBJ) {
  return function (req, res, next) {
    req[name] = dbOBJ;
    next();
  };
};
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(attachDB('db', db));
app.use(attachDB('eventdb', eventdb));
app.use(attachDB('photosdb', photosdb));
app.use('/', index);
app.use('/editor', index);
app.use('/edit', editorController);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
