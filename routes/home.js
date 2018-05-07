var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  data = {
    title: 'home',
  };
  res.render('home', data);
});


router.post('/', function(req, res, next) {
  data = {
      title: 'home',
  };
  res.render('home', data);
});

module.exports = router;