var config = require('../../config');
var request = require('request').defaults(config.requestOptions);
var faker = require('faker');
var expect = require('chai').expect;
var async = require('async');
var Item = require('../item/item.model');
var SubItem = require('../subitem/subitem.model');
var SubSubItem = require('./subsubitem.model');
var helpers = require('../../test/helpers');

describe('subsubitems', function() {
  var items = [];
  var subItems = [];
  var subSubItems = [];
  var itemsQty = 10;
  var subItemsQty = 20;
  var subSubItemsQty = 40;
  var checkCountSubItemId = null;

  before(function(done) {
    helpers.dbConnection(done);
  });

  beforeEach(function(done) {
    async.waterfall([
      // Создаём items
      function(next) {
        async.times(itemsQty, function(n, cb) {
          new Item(generateItemData()).save(function(err, item) {
            expect(err).is.null;
            items.push(item);
            cb();
          });
        }, function() {
          next();
        });
      },
      // Создаём subitems для items[0]
      function(next) {
        async.times(subItemsQty, function(n, cb) {
          new SubItem(generateSubItemData(items[0]._id.toString())).save(function(err, item) {
            expect(err).is.null;
            subItems.push(item);
            cb();
          });
        }, function() {
          next();
        });
      },
      // Создаём subitems для items[1]
      function(next) {
        async.times(subItemsQty, function(n, cb) {
          new SubItem(generateSubItemData(items[1]._id.toString())).save(function(err, item) {
            expect(err).is.null;
            subItems.push(item);
            cb();
          });
        }, function() {
          next();
        });
      }
    ], function() {
      done();
    });
  });

  afterEach(function(done) {
    async.waterfall([
      function(next) {
        SubSubItem.remove({}, next);
      },
      function(r, next) {
        SubItem.remove({}, next);
      },
      function(r, next) {
        Item.remove({}, next);
      }
    ], function() {
      items.length = 0;
      subItems.length = 0;
      subSubItems.length = 0;
      done();
    });
  });

  describe('creation', function() {
    it('success', function(done) {
      request.post('/subsubitems', {
        form: generateSubSubItemData(subItems[0].item.toString(), subItems[0]._id.toString())
      }, function(err, res, body) {
        expect(err).is.null;
        expect(res.statusCode).to.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.ownProperty('id');
        expect(body).to.not.have.ownProperty('_id');
        done();
      });
    });
  });

  describe('list', function() {
    beforeEach(function(done) {
      async.waterfall([
        // Создаём subsubitems для всех subitems
        function(next) {
          async.each(subItems, function(data, cb) {
            new SubSubItem(generateSubSubItemData(
              data.item.toString(), data._id.toString()
            )).save(function(err, item) {
              expect(err).is.null;
              subSubItems.push(item);
              cb();
            });
          }, function() {
            next();
          });
        },
        // Создаём {{subSubItemsQty}} раз subsubitems для subitems[0]
        function(next) {
          async.times(subSubItemsQty, function(n, cb) {
            checkCountSubItemId = subItems[1]._id.toString();
            new SubSubItem(generateSubSubItemData(
              subItems[1].item.toString(), subItems[1]._id.toString()
            )).save(function(err, item) {
              expect(err).is.null;
              subSubItems.push(item);
              cb();
            });
          }, function() {
            next();
          });
        }
      ], function() {
        done();
      });
    });

    it('success', function(done) {
      request.get('/subsubitems', function(err, res, body) {
        expect(err).is.null;
        expect(res.statusCode).to.equal(200);
        expect(body).to.be.an('array');
        expect(body).to.have.length(subSubItemsQty + subItemsQty * 2);
        expect(body[0]).to.have.ownProperty('id');
        expect(body[0]).to.not.have.ownProperty('_id');
        done();
      });
    });

    describe('grouped list', function() {
      it('success', function(done) {
        request.get('/subsubitems/grouped', function(err, res, body) {
          expect(err).is.null;
          expect(res.statusCode).to.equal(200);
          expect(body).to.be.an('array');
          expect(body).to.have.length(2);
          body.forEach(function(i) {
            expect(i).to.have.ownProperty('subItems');
            expect(i).to.have.ownProperty('qty');
            expect(i).to.have.ownProperty('item');
            expect(i.subItems).to.be.an('array');
            expect(i.qty).to.be.an('number');
            expect(i.item).to.be.an('string');
            expect(i.qty).to.be.equal(subItemsQty);
            expect(i.subItems).to.have.length(subSubItemsQty / 2);

            i.subItems.forEach(function(si) {
              expect(si).to.have.ownProperty('qty');
              expect(si).to.have.ownProperty('subItem');
              expect(si.qty).to.be.an('number');
              expect(si.subItem).to.be.an('string');
              if (checkCountSubItemId !== si.subItem) {
                expect(si.qty).to.be.equal(1);
              } else {
                expect(si.qty).to.be.equal(subSubItemsQty + 1);
              }
            });
          });
          done();
        });
      });
    });
  });
});

function generateItemData() {
  return {name: faker.name.firstName()};
}

function generateSubItemData(itemId) {
  return {name: faker.name.firstName(), item: itemId, secret: faker.name.lastName()};
}

function generateSubSubItemData(itemId, subItemId) {
  return {name: faker.name.firstName(), item: itemId, subItem: subItemId};
}
