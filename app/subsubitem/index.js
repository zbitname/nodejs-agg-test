var express = require('express');
var controller = require('./subsubitem.controller');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/grouped', controller.grouped);

module.exports = router;
