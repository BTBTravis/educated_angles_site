var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var getCMSData = new Promise((resolve, reject) => {
    req.db.find({}, function (err, docs) {
      docs = docs.reduce(function (obj, doc) {
        obj[doc.title] = doc.html;
        return obj;
      }, {});
      resolve(docs);
    });
  });
  var getEvents = new Promise((resolve, reject) => {
    req.eventdb.find({ event_type: 'signupgenius' }).sort({ starttime: 1 }).exec(function (err, docs) {
      resolve(docs);
    });
  });
  var getFacebookEvents = new Promise((resolve, reject) => {
    req.eventdb.find({ event_type: 'facebook' }).sort({ unix: 1 }).exec(function (err, docs) {
      resolve(docs);
    });
  });
  var getFacebookPhotos = new Promise((resolve, reject) => {
    req.photosdb.find({}).sort({ created_unix: -1 }).limit(7).exec(function (err, docs) {
      resolve(docs);
    });
  });
  Promise.all([getCMSData, getEvents, getFacebookEvents, getFacebookPhotos]).then(function (results) {
    var data = results[0];
    data.signupgenius = results[1];
    data.facebook = results[2];
    data.photos = results[3];
    res.render('index', data);
  });
});
router.get('/editor', function(req, res, next) {
  req.db.find({}).sort({order: 1}).exec(function (err, docs) {
    // docs = docs.reduce(function (arr, doc) {

    //   obj[doc.title] = doc;
    //   return obj;
    // }, []);
    // res.render('index', docs);
    // var fields = {fields: docs}
    res.render('editor', {fields: docs});
  });
});

module.exports = router;
