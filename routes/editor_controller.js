var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function (req, res, next) {
  console.log(req);
  // res.send("Posting to edit endpt");
  var test = ['test', 'test'];
  res.json(test);
});
// router.get('/', function (req, res, next) {
//   res.send("HITTING THE EDIT END PT");
// });

module.exports = router;
