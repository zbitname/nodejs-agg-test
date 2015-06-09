var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var config = require('./config');

app.db = mongoose.connection;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', require('./app/index'));

mongoose.connect(config.mongoUri);

app.db.once('open', function() {
  console.info('Connected to DB ', config.mongoUri);

  app.listen(config.port, function() {
    console.info('Express server listening on port ', config.port);
  });
});

app.use(function(req, res) {
  res.status(404).json().end();
});

app.use(function(err, req, res) {
  res.status(500).json().end(err);
});

module.exports = app;
