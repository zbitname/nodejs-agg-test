var config = require('../../config');
var request = require('request').defaults(config.requestOptions);
var faker = require('faker');
var expect = require('chai').expect;
var async = require('async');
var SubItem = require('./subitem.model');
var Item = require('../item/item.model');
var helpers = require('../../test/helpers');

describe('subitems', function() {
  var items = [];
  var subItems = [];
  var itemsQty = 10;
  var subItemsQty = 20;

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
      }
    ], function() {
      done();
    });
  });

  afterEach(function(done) {
    async.waterfall([
      function(next) {
        SubItem.remove({}, next);
      },
      function(r, next) {
        Item.remove({}, next);
      }
    ], function() {
      items.length = 0;
      subItems.length = 0;
      done();
    });
  });

  describe('creation', function() {
    it('success', function(done) {
      request.post('/subitems', {form: generateSubItemData(items[0])}, function(err, res, body) {
        expect(err).is.null;
        expect(res.statusCode).to.equal(201);
        expect(body).to.be.an('object');
        expect(body).to.have.ownProperty('id');
        expect(body).to.not.have.ownProperty('_id');
        expect(body).to.not.have.ownProperty('secret');
        done();
      });
    });
  });

  describe('list', function() {
    beforeEach(function(done) {
      async.waterfall([
        // Создаём subitems для items[0]
        function(next) {
          async.times(subItemsQty, function(n, cb) {
            new SubItem(generateSubItemData(items[0])).save(function(err, item) {
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
            new SubItem(generateSubItemData(items[1])).save(function(err, item) {
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

    it('success', function(done) {
      request.get('/subitems', function(err, res, body) {
        expect(err).is.null;
        expect(res.statusCode).to.equal(200);
        expect(body).to.be.an('array');
        expect(body).to.have.length(subItemsQty * 2);
        expect(body[0]).to.have.ownProperty('id');
        expect(body[0]).to.not.have.ownProperty('_id');
        expect(body[0]).to.not.have.ownProperty('secret');
        done();
      });
    });
  });
});

function generateItemData() {
  return {name: faker.name.firstName()};
}

function generateSubItemData(item) {
  return {name: faker.name.firstName(), item: item._id.toString(), secret: faker.name.lastName()};
}
