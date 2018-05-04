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

  res("TEST");

  //Promise.all([cockpit.getEvents(), cockpit.getHomePageSections(), cockpit.getHomePageCards(), signupGenius.getEvents()]).then(function (results) {
    //var data = {
      //events: results[1].sections,
      //titles: results[1].titles,
      //signupgenius: results[3],
      //facebook: results[0],
      //homepagecards: results[2]
    //};
    //res.render('index', data);
  //}).catch(function (e) {
    //console.log({error: e});
  //});
});

module.exports = router;
