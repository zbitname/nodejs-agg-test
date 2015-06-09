var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var subSubItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  subItem: {
    type: ObjectId,
    required: true,
    ref: 'SubItem'
  },
  item: {
    type: ObjectId,
    required: true,
    ref: 'Item'
  }
});

var SubSubItem = mongoose.model('SubSubItem', subSubItemSchema);

module.exports = SubSubItem;
