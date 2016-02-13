'use strict';

var app = require('../..');
var request = require('supertest');

describe('Lead API:', function() {

  describe('GET /api/leads', function() {
    var leads;

    beforeEach(function(done) {
      request(app)
        .get('/api/leads')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          leads = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      leads.should.be.instanceOf(Array);
    });

  });

});
