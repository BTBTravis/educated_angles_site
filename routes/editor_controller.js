var express = require('express');
// require('dotenv').config();
var axios = require('axios');
var moment = require('moment');
var router = express.Router();
var FB = require('fb');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

FB.setAccessToken(process.env.FACEBOOK_KEY);
/* GET users listing. */
router.put('/', function (req, res, next) {
  req.body.map(function (field) {
    req.db.update({ title: field.title }, { $set: { delta: field.delta, html: field.html } }, { multi: true }, function (err, numReplaced) {
      // TODO: add error handling
    });
  });
  res.json({ status: 200 });
});
router.get('/update', function (req, res, next) {
  // update signupgenius events
  axios.get('https://api.signupgenius.com/v2/k/signups/created/active/?user_key=' + process.env.SIGNUPGENIUS_KEY)
    .then(function (response) {
      // console.log(response.data.data);
      req.eventdb.remove({ event_type: 'signupgenius' }, { multi: true });
      response.data.data.map(function (evt) {
        evt.event_type = 'signupgenius';
        evt.month = moment(evt.starttime).format('MMM');
        evt.day = moment(evt.starttime).format('D');
        req.eventdb.insert(evt);
      });
    });
  // update facebook events
  FB.api(
    '/educatedangels/events',
    'GET',
    { 'time_filter': 'upcoming' },
    function (response) {
      // console.log({FBresponse: response});
      req.eventdb.remove({ event_type: 'facebook' }, { multi: true });
      response.data.map(function (evt) {
        evt.event_type = 'facebook';
        evt.month = moment(evt.start_time).format('MMM');
        evt.day = moment(evt.start_time).format('D');
        evt.unix = moment(evt.start_time).format('X');
        req.eventdb.insert(evt);
      });
    }
  );
  req.photosdb.remove({}, { multi: true });
  // update facebook photos
  var fbGetImages = new Promise((resolve, reject) => {
    FB.api(
      '/educatedangels?fields=albums.fields(photos.fields(source,created_time))',
      'GET',
      { 'time_filter': 'upcoming' },
      function (response) {
        resolve(response.albums.data[0].photos.data);
      }
    );
  });
  fbGetImages.then(function (photos) {
    console.log({photos: photos});
    // get photos
    var processIMG = photos.map(function (photo) {
      return axios({
        method: 'get',
        url: photo.source,
        responseType: 'stream'
      }).then(function (response) {
        return new Promise((resolve, reject) => {
          var params = {Bucket: 'educated-angles', Key: photo.id, Body: response.data, ContentType: 'image/jpeg'};
          s3.upload(params, function(err, data) {
            if (err) reject(err);
            resolve(data);
          });
        });
      }).then(function (data) {
        return { s3url: 'https://educated-angles.s3.us-west-2.amazonaws.com/' + photo.id, id: photo.id, fburl: photo.source, created_time: photo.created_time };
      })
      .then(function (imgOBJ) {
        imgOBJ.created_unix = moment(imgOBJ.created_time).format('X');
        req.photosdb.insert(imgOBJ);
        return {uploaded: imgOBJ};
      });
    });
    return Promise.all(processIMG);
  })
  .then(function (imgs) {
    console.log({imgs: imgs});
  })
  .catch(function (e) {
    console.log({e: e});
  });
  // FB.api(
  //   '/educatedangels?fields=albums.fields(photos.fields(source))',
  //   'GET',
  //   { 'time_filter': 'upcoming' },
  //   function (response) {
  //     var photos = response.albums.data[0].photos.data;
  //     photos.map(function(photo){
  //       axios({
  //         method: 'get',
  //         url: photo.source,
  //         responseType: 'stream'
  //       })
  //       .then(function(response) {
  //         // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
  //         var params = {Bucket: 'educated-angles', Key: photo.id, Body: response.data};
  //         s3.upload(params, function(err, data) {
  //           console.log(err, data);
  //         });
  //         var urlParams = {Bucket: 'educated-angles', Key: photo.id};
  //         s3.getSignedUrl('getObject', urlParams, function(err, url){
  //           console.log('the url of the image is', url);
  //         });
  //       });
  //     });

      // console.log({photos: photos});
      // photos.map(function (pic) {
      //   console.log(pic);
      // });
      // req.eventdb.remove({ event_type: 'facebook' }, { multi: true });
      // response.data.map(function (evt) {
      //   evt.event_type = 'facebook';
      //   evt.month = moment(evt.start_time).format('MMM');
      //   evt.day = moment(evt.start_time).format('D');
      //   evt.unix = moment(evt.start_time).format('X');
      //   req.eventdb.insert(evt);
      // });
  //   }
  // );

  res.json({ status: 200 });
});
module.exports = router;
