var config = require('../config');
var fs = require('fs');
var webTorrent = require('webtorrent');
var db = require('../model/db');


var STATUS_READY = 'READY';
var STATUS_DOWNLOAD = 'DOWNLOAD';
var STATUS_DONE = 'DONE';


function Torrent() {
  this.addOpt = { path: config.torrent.tmp_path };
  this.client = new webTorrent();

  initTorrent(this);
}


function initTorrent(torrent) {
  db.selectTorrentByStatus(STATUS_READY, (err, rows) => {
    if (rows && rows.length > 0) {
      rows.forEach((row) => {
        console.log('Try init torrent: ' + row.name);
        torrent.add(row.magnet, '', false);
      });
    }
  });
  db.selectTorrentByStatus(STATUS_DOWNLOAD, (err, rows) => {
    if (rows && rows.length > 0) {
      rows.forEach((row) => {
        console.log('Try init torrent: ' + row.name);
        torrent.add(row.magnet, '', false);
      });
    }
  });
}



Torrent.prototype.add = function(magnetOrTorrent, torrentPath, needInsert, cb) {
  var self = this;
  
  if (typeof torrentPath === 'function') {
    cb = torrentPath;
    torrentPath = '';
    needInsert = true;
  } else if (typeof needInsert === 'function') {
    cb = needInsert;
    needInsert = true;
  }

  if (typeof cb !== 'function') {
    cb = function(){};
  }

  this.client.removeAllListeners('warning');
  this.client.once('warning', (err) => {
    console.log('Torrent.add warning:' + err);
    cb(err);
  });

  this.client.removeAllListeners('error');
  this.client.once('error', (err) => {
    console.log('Torrent.add error:' + err);
    cb(err);
  });
 
  this.client.add(magnetOrTorrent, this.addOpt, (torrent) => {
    console.log('Torrent.add confirmed: ' + torrent.name);
    
    function checkProgress() {
      var interval = setInterval(function() {
        var data = {
          magnet: torrent.magnetURI,
          status: STATUS_DOWNLOAD,
          progress: torrent.progress * 100
        };
        if (torrent.done) {
          console.log('Torrent.add DONE:' + torrent.name);
          data.status = STATUS_DONE;
          clearInterval(interval);
          self.client.remove(torrent.magnetURI);
        }
        db.updateTorrent(data);
      }, 5000);
    }

    if (needInsert) {
      db.selectTorrentByMagnet(torrent.magnetURI, (err, rows) => {
        if (err) cb(err);
        else if (rows && rows.length > 0) cb(new Error('Torrent already exists'));
        else {
          var data = {
            magnet: torrent.magnetURI,
            torrentPath: torrentPath,
            name: torrent.name,
            length: torrent.length,
            downPath: torrent.path + torrent.name,
            status: STATUS_READY,
            progress: 0
          };
          db.insertTorrent(data);
      
          checkProgress();
       
          cb();
        }
      });
    } else {
      checkProgress();
    }
  });
  
};


Torrent.prototype.addMagnet = function(magnet, cb) {
  this.add(magnet, cb);
};


Torrent.prototype.addTorrent = function(torrent, cb) {
  fs.readFile(torrent.path, (err, data) => {
    if (err) {
      cb(err);
    } else {
      this.add(data, torrent.path, cb);
    }
  });
};


Torrent.prototype.getTorrents = function(cb) {
  db.selectTorrentAll(cb);
}


module.exports = new Torrent();

