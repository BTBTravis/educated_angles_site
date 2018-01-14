var express = require('express');
var router = express.Router();

/* GET users listing. */
router.put('/', function (req, res, next) {
  req.body.map(function (field) {
    req.db.update({ title: field.title }, { $set: { delta: field.delta, html: field.html } }, { multi: true }, function (err, numReplaced) {
      // TODO: add error handling
    });
  });
  res.json({ status: 200 });
});
module.exports = router;
