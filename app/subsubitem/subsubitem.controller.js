var SubSubItem = require('./subsubitem.model');

module.exports.index = index;
module.exports.create = create;
module.exports.grouped = grouped;

function index(req, res, next) {
  SubSubItem.find({}, function(err, items) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.json(items).end();
  });
}

function create(req, res, next) {
  new SubSubItem(req.body).save(function(err, subitem) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.status(200).json(subitem).end();
  });
}

function grouped(req, res, next) {
  var query = SubSubItem.aggregate();

  query.exec(function(err, items) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.json(items).end();
  });
}
