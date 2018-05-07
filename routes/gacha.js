var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  data = {
    title: 'gacha',
    image_id: 0,
  };
  res.render('gacha', data);
});


router.post('/', function(req, res, next) {
  var img_min = 1;
  var img_max = 3;
  var image_id = Math.floor(Math.random() * (img_max - img_min + 1) + img_min);
  data = {
      title: 'gacha',
      image_id: image_id,
  };
  res.render('gacha', data);
});

module.exports = router;