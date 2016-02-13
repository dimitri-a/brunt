'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var AdminSchema = new Schema({
  name: String,

  role: {
    type: String,
    default: 'lead'
  },
  hashedPassword: String,
  provider: String,
  salt: String
});

/**
 * Virtuals
 */
AdminSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
AdminSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
AdminSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */
// Validate empty name
AdminSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');


// Validate empty address
AdminSchema
  .path('address')
  .validate(function(address) {
    return address.length;
  }, 'Address cannot be blank');


// Validate empty address
AdminSchema
  .path('phone')
  .validate(function(phone) {
    return phone;
  }, 'Phone cannot be blank');


// Validate empty address
AdminSchema
  .path('mobile')
  .validate(function(mobile) {
    return mobile;
  }, 'Mobile cannot be blank');


// Validate empty email
AdminSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');


// Validate empty password
AdminSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
AdminSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
AdminSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
AdminSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Lead', AdminSchema);
