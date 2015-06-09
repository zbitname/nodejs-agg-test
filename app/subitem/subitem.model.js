var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var subItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  item: {
    type: ObjectId,
    required: true,
    ref: 'Item'
  },
  secret: {
    type: String,
    required: true
  }
});

var SubItem = mongoose.model('SubItem', subItemSchema);

module.exports = SubItem;
