var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost/objective');

db.on('error', console.error);

module.exports = db;