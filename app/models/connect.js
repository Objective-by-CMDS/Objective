var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://moin.2013.nodeknockout.com/objective');

db.on('error', console.error);

module.exports = db;