var express = require('express');
var router = express.Router();
var navi = require('./navi.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { menus: navi.getMenus("Home") });
});

module.exports = router;
