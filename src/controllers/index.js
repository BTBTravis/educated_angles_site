import express from 'express';
import createSignupGeniusAPI from '../models/signup-genius.js';
import createCockpitAPI from '../models/cockpit.js';
import axios from 'axios';
import moment from 'moment';

var router = express.Router();
let cockpit = createCockpitAPI({
  axios: axios,
  moment: moment
});

let signupGenius = createSignupGeniusAPI({
  axios: axios,
  moment: moment
});

//router.get('/', (req, res, next) => {
  //res.render('index', {
    //titles: [['fuck', 'fuck']]
  //});
//});

//let preloadData = Promise.all([cockpit.getEvents(), cockpit.getHomePageSections(), cockpit.getHomePageCards(), signupGenius.getEvents()])
//let preloadData = Promise.all([signupGenius.getEvents()])
//.then(data => {
  //console.log('data: ', data);
//})
//.catch(e => console.log('error preloading data'));

let preloadData = Promise.all([cockpit.getEvents(), cockpit.getHomePageSections(), cockpit.getHomePageCards(), signupGenius.getEvents()])
  .then(results => {
    var data = {
      sections: results[1].sections,
      titles: results[1].titles,
      signupgenius: results[3],
      facebook: results[0],
      homepagecards: results[2]
    };

    router.get('/', (req, res, next) => {
      res.render('index', data);
    });

  })
  .catch(e => console.log('error preloading data', e));

/* GET home page. */
//router.get('/', function (req, res, next) {
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
//});

module.exports = router;
