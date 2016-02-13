'use strict';

var should = require('should');
var app = require('../../app');
var adminUser = require('./admin.model.js');

var adminUser = new AdminUser({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('Admin User Model', function() {
  before(function(done) {
    // Clear users before testing
    adminUser.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    adminUser.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    adminUser.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate user', function(done) {
    adminUser.save(function() {
      var userDup = new User(user);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    adminUser.email = '';
    adminUser.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate user if password is valid", function() {
    return adminUser.authenticate('password').should.be.true;
  });

  it("should not authenticate user if password is invalid", function() {
    return adminUser.authenticate('blah').should.not.be.true;
  });
});
