var express = require('express');
var router = express.Router();

router.use('/items', require('./item'));
router.use('/subitems', require('./subitem'));

module.exports = router;
