var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.db.find({}, function (err, docs) {
    docs = docs.reduce(function (obj, doc) {
      obj[doc.title] = doc.html;
      return obj;
    }, {});
    res.render('index', docs);
  });
});
router.get('/editor', function(req, res, next) {
  req.db.find({}, function (err, docs) {
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
