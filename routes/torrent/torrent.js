var express = require('express');
var router = express.Router();
var navi = require('../navi.js');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var torrent = require('../../methods/torrent.js');


router.get('/', function(req, res, next) {
  renderTorrentAdd(res);
});


router.get('/add', function(req, res, next) {
  renderTorrentAdd(res);
});


router.get('/list', function(req, res, next) {
  renderTorrentList(req, res);
});


router.get('/search', function(req, res, next) {
  searchTorrent(req, res);
});


router.post('/add/magnet', function(req, res, next) {
  var magnet = req.body.magnet;
 
  if (!magnet) {
    responseAddTorrent(res, new Error('No magnet provided'));
  } else {
    torrent.addMagnet(magnet, (err) => {
      responseAddTorrent(res, err, 'Successfully added');
    });
  }
});


router.post('/add/torrent', upload.single('torrent'), function(req, res, next) {
  var torrentInfo = req.file;

  if (!torrentInfo) {
    responseAddTorrent(res, new Error('No torrent provided'));
  } else {
    torrent.addTorrent(torrentInfo, (err) => {
      responseAddTorrent(res, err, 'Successfully added');
    });
  }
});


function responseAddTorrent(res, err, message) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  if (err) {
    res.end(JSON.stringify({success: false, message: err.message}));
  } else {
    res.end(JSON.stringify({success: true, message: message}));
  }
}


function searchTorrent(req, res) {
  console.log('serarch torrent');
  res.writeHead(200, {'Content-Type': 'application/json'});
  torrent.getTorrents((err, rows) => {
    console.log('now callback');
    var data = {};
    if (err) data.error = err.message;
    else if (!rows || rows.length == 0) data.message = 'No torrents';
    else data.data = rows;
    res.end(JSON.stringify(data));
  });
}


function renderTorrentAdd(res, message) {
  res.render('torrent/torrent_add', {
    menus: navi.getMenus('Torrent'),
    message: message ? message : ""
  });
}


function renderTorrentList(req, res) {
  res.render('torrent/torrent_list', {
    menus: navi.getMenus('Torrent'),
    message: 'Fetching data...'
  });
}


module.exports = router;
