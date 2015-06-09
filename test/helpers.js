var mongoose = require('mongoose');
var config = require('../config');

module.exports.dbConnection = function(cb) {
  if (mongoose.Connection.STATES.connected === mongoose.connection.readyState) {
    return mongoose.connection.db.dropDatabase(cb);
  }

  mongoose.connection.once('open', function() {
    mongoose.connection.db.dropDatabase(cb);
  });
  mongoose.connect(config.mongoUri);
};
