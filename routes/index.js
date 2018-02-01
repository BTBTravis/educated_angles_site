var express = require('express');
var router = express.Router();
var axios = require('axios');
/* GET home page. */
router.get('/', function (req, res, next) {
  var getCMSData = axios.get(process.env.CMS_PATH + '?rest_route=/wp/v2/sections&_embed')
    .then(function (cmsData) {
      // console.log({cmsData: cmsData.data});
      cmsData.data.reverse();
      let h1s = cmsData.data.reduce(function (arr, section) {
        var titles = [];
        var regex1 = RegExp('h1 id="([^"]+)">([^<]+)','g');
        var matches;
        while ((matches = regex1.exec(section.body_content)) !== null) {
          titles.push([matches[1], matches[2]]);
        }
        return arr.concat(titles);
      }, [
        ['volunteer_opportunities', 'Volunteer Opportunities'],
        ['upcoming_events', 'Upcoming Events']
      ]);
      let sections =cmsData.data.map(function (section) {
        section.featuredImage = section._embedded['wp:featuredmedia'][0].source_url;
        return section;
      });
      return { sections: sections, titles: h1s };
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
  var getCallsToAction = axios.get(process.env.CMS_PATH + '?rest_route=/wp/v2/call-to-action')
    .then(function (cmsData) {
      return cmsData.data[0].action_text;
    });
  var getHomePageCards = axios.get(process.env.CMS_PATH + '?rest_route=/wp/v2/home_page_card&_embed')
    .then(function (cmsData) {
      return cmsData.data.map(function (card) {
        card.featuredImage = card._embedded['wp:featuredmedia'][0].source_url;
        return card;
      });
    });
  Promise.all([getCMSData, getEvents, getFacebookEvents, getFacebookPhotos, getCallsToAction, getHomePageCards]).then(function (results) {
    var data = {};
    data.sections = results[0].sections;
    data.titles = results[0].titles;
    data.signupgenius = results[1];
    data.facebook = results[2];
    data.photos = results[3];
    data.calltoaction = results[4];
    data.homepagecards = results[5];
    res.render('index', data);
  }).catch(function (e) {
    console.log({error: e});
  });
});

module.exports = router;
