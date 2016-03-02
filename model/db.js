var config = require('../config');
var sqlite3 = require('sqlite3');


function DB() {
  this.db = new sqlite3.Database(config.database.path);
  
  createTables(this.db);
}


function createTableTorrent(db) {
  db.run('CREATE TABLE IF NOT EXISTS torrent (magnet UNIQUE, torrent_path UNIQUE, name, length, down_path, status, progress)');
}


function createTables(db) {
  db.serialize(() => {
    createTableTorrent(db);
  });
}


DB.prototype.selectTorrentAll = function(cb) {
  var err = null;
  var rows = null;
  
  this.db.prepare('SELECT rowid, * FROM torrent')
    .all((e, r) => {
      if (e) err = e;
      else rows = r;
  }).finalize((e) => {
      if (e) err = e;
      if (cb) cb(err, rows);
  });
}


DB.prototype.selectTorrentByMagnet = function(magnet, cb) {
  var err = null;
  var rows = null;

  this.db.prepare('SELECT rowid, * FROM torrent WHERE magnet=?', magnet)
    .all((e, r) => {
      if (e) err = e;
      else rows =r;
  }).finalize((e) => {
      if (e) err = e;
      if (cb) cb(err, rows);
  });
}


DB.prototype.selectTorrentByStatus = function(status, cb) {
  var err = null;
  var rows = null;

  this.db.prepare('SELECT rowid, * FROM torrent WHERE status=?', status)
    .all((e, r) => {
      if (e) err = e;
      else rows =r;
  }).finalize((e) => {
      if (e) err = e;
      if (cb) cb(err, rows);
  });
}

DB.prototype.insertTorrent = function(data, cb) {
  var err = null;

  this.db.prepare('INSERT INTO torrent VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(data.magnet,
         data.torrentPath,
         data.name,
         data.length,
         data.downPath, 
         data.status,
         data.progress,
         (e) => {
      if (e) err = e;
  }).finalize((e) => {
      if (e) err = e;
      if (cb) cb(err);
  });
}


DB.prototype.updateTorrent = function(data, cb) {
  var err = null;

  this.db.prepare('UPDATE torrent SET status=?, progress=? WHERE magnet=?')
    .run(data.status, data.progress, data.magnet, (e) => {
      if (e) err = e;
  }).finalize((e) => {
      if (e) err = e;
      if (cb) cb(err);
  });
}


module.exports = new DB();

