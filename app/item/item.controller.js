var Item = require('./item.model');
// var _ = require('lodash');

module.exports.index = index;
module.exports.create = create;

function index(req, res, next) {
  Item.find({}, function(err, items) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.json(items).end();
  });
}

function create(req, res, next) {
  new Item(req.body).save(function(err, item) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.status(201).json(item).end();
  });
}
