import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import index from './controllers/index';



//express setup
export default function genServer() {
  var app = express();
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'twig');
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); uncomment after placing your favicon in /public
  app.use(logger('dev')); // log to the console
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  let publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  app.use('/', index);

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

  return app;
}
