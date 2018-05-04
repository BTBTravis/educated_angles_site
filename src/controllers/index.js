import express from 'express';
import createSignupGeniusAPI from '../models/signup-genius.js';
import createCockpitAPI from '../models/cockpit.js';
import axios from 'axios';
import moment from 'moment';

var router = express.Router();
let cockpit = createCockpitAPI({
  axios: axios,
  env: {
    cockpitPath: process.env.COCKPIT_PATH,
    cockpitToken: process.env.COCKPIT_TOKEN
  }
});
let signupGenius = createSignupGeniusAPI({
  axios: axios,
  moment: moment,
  env: {
    key: process.env.SIGNUPGENIUS_KEY
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {

  Promise.all([cockpit.getEvents(), cockpit.getHomePageSections(), cockpit.getHomePageCards()]).then(function (results) {
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
