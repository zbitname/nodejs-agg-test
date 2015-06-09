var config = require('../../config');
var request = require('request').defaults(config.requestOptions);
var faker = require('faker');
var expect = require('chai').expect;
var async = require('async');
var Item = require('./item.model');
var helpers = require('../../test/helpers');

describe('items', function() {
  before(function(done) {
    helpers.dbConnection(done);
  });

  afterEach(function(done) {
    async.waterfall([
      function(next) {
        Item.remove({}, next);
      }
    ], function() {
      done();
    });
  });

  describe('creation', function() {
    it('success', function(done) {
      request.post('/items', {form: {name: faker.name.firstName()}}, function(err, res, body) {
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
    var items = [];
    var qty = 10;

    beforeEach(function(done) {
      async.times(qty, function(n, cb) {
        new Item(generateItemData()).save(function(err, item) {
          expect(err).is.null;
          items.push(item);
          cb();
        });
      }, function() {
        done();
      });
    });

    it('success', function(done) {
      request.get('/items', function(err, res, body) {
        expect(err).is.null;
        expect(res.statusCode).to.equal(200);
        expect(body).to.be.an('array');
        expect(body).to.have.length(qty);
        expect(body[0]).to.have.ownProperty('id');
        expect(body[0]).to.not.have.ownProperty('_id');
        done();
      });
    });
  });
});

function generateItemData() {
  return {name: faker.name.firstName()};
}
