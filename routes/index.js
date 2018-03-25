var express = require('express');
var router = express.Router();
var axios = require('axios');
//util functions
let fullPathImages = function (res) {
  let imgKeys = [];
  for(var key in res.data.fields) if(res.data.fields[key].type === 'image') imgKeys.push(key);
  res.data.entries = res.data.entries.map(entry => {
    imgKeys.map(key => {
      //api/cockpit/image?token=xxtokenxx&src=path&w=200&h=200&o=true
      if(entry.hasOwnProperty(key)) entry[key] = (process.env.CMS_PATH.substring(0, process.env.CMS_PATH.length - 4)) + entry[key].path;
    });
    return entry;
  });
  return res;
}
/* GET home page. */
router.get('/', function (req, res, next) {
  var getCMSData = axios.get(process.env.CMS_PATH + 'collections/get/home_page_sections?token=' + process.env.CMS_TOKEN)
    .then(function (cmsData) {
      //Titles
      cmsData = fullPathImages(cmsData);
      let staticTitles = [
        ['upcoming_events', 'Upcoming Events'],
        ['volunteer_opportunities', 'Volunteer Opportunities']
      ];
      let titles = cmsData.data.entries.map((entry, i) => ["section_" + i, entry.title]);
      let finalTitles = staticTitles.concat(titles);
      return { sections: cmsData.data.entries, titles: finalTitles  };
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
  var getCallsToAction = Promise.resolve([]);
    //axios.get(process.env.CMS_PATH + '?rest_route=/wp/v2/call-to-action')
    //.then(function (cmsData) {
      //return cmsData.data[0].action_text;
    //});

  var getHomePageCards = axios.get(process.env.CMS_PATH + 'collections/get/home_page_cards?token=' + process.env.CMS_TOKEN)
    .then(function (cmsData) {
      cmsData = fullPathImages(cmsData);
      console.log("Cards: ", cmsData.data.entries);
      return cmsData.data.entries;
      //return fullPathImages(cmsData);
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
