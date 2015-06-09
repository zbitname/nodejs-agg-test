var SubItem = require('./subitem.model');

module.exports.index = index;
module.exports.create = create;

function index(req, res, next) {
  SubItem.find({}, function(err, items) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
    res.json(items).end();
  });
}

function create(req, res, next) {
  new SubItem(req.body).save(function(err, subitem) {
    if (err) {
      return res.status(500).json(err.message || err).end();
    }
  });
}
