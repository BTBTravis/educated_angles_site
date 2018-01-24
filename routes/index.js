var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var getCMSData = new Promise((resolve, reject) => {
    req.db.find({}, function (err, docs) {
      let htmls = docs.reduce(function (obj, doc) {
        obj[doc.title] = doc.html;
        return obj;
      }, {});
      let h1s = docs.reduce(function (arr, doc) {
        // var matches = doc.html.match(/h1 id="([^"]+)/g);
        var titles = [];
        var regex1 = RegExp('h1 id="([^"]+)">([^<]+)','g');
        var matches;
        while ((matches = regex1.exec(doc.html)) !== null) {
          titles.push([matches[1], matches[2]]);
        }
        // console.log({matches: matches});
        // return titles.concat(arr);
        return arr.concat(titles);
      }, []);
      h1s.unshift(['volunteer_opportunities', 'Volunteer Opportunities']);
      h1s.unshift(['upcoming_events', 'Upcoming Events']);
      console.log({h1s: h1s});
      resolve([htmls, h1s]);
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
    var data = results[0][0];
    data.titles = results[0][1];
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
