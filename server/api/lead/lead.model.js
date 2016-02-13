'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var LeadSchema = new Schema({
  name: String,
  address: String,
  dob: Date,
  phone: Number,
  mobile: Number,
  email: { type: String, lowercase: true },
  note: String,
  consent: Boolean
});

//
///**
// * Virtuals
// */
//LeadSchema
//  .virtual('password')
//  .set(function(password) {
//    this._password = password;
//    this.salt = this.makeSalt();
//    this.hashedPassword = this.encryptPassword(password);
//  })
//  .get(function() {
//    return this._password;
//  });
//
//// Public profile information
//LeadSchema
//  .virtual('profile')
//  .get(function() {
//    return {
//      'name': this.name,
//      'role': this.role
//    };
//  });
//
//// Non-sensitive info we'll be putting in the token
//LeadSchema
//  .virtual('token')
//  .get(function() {
//    return {
//      '_id': this._id,
//      'role': this.role
//    };
//  });
//
///**
// * Validations
// */
//// Validate empty name
//LeadSchema
//  .path('name')
//  .validate(function(name) {
//    return name.length;
//  }, 'Name cannot be blank');
//
//
//// Validate empty address
//LeadSchema
//  .path('address')
//  .validate(function(address) {
//    return address.length;
//  }, 'Address cannot be blank');
//
//// Validate empty address
//LeadSchema
//  .path('dob')
//  .validate(function(dob) {
//    return dob.length;
//  }, 'dob cannot be blank');
//
//
//
//// Validate empty address
//LeadSchema
//  .path('phone')
//  .validate(function(phone) {
//    return phone;
//  }, 'Phone cannot be blank');
//
//
//// Validate empty address
//LeadSchema
//  .path('mobile')
//  .validate(function(mobile) {
//    return mobile;
//  }, 'Mobile cannot be blank');
//
//
//// Validate empty email
//LeadSchema
//  .path('email')
//  .validate(function(email) {
//    return email.length;
//  }, 'Email cannot be blank');
//
//
//// Validate empty address
//LeadSchema
//  .path('note')
//  .validate(function(note) {
//    return note.length;
//  }, 'note cannot be blank');
//
//// Validate empty address
//LeadSchema
//  .path('consent')
//  .validate(function(consent) {
//    return consent.length;
//  }, 'consent cannot be blank');
//
//
//// Validate empty password
//LeadSchema
//  .path('hashedPassword')
//  .validate(function(hashedPassword) {
//    return hashedPassword.length;
//  }, 'Password cannot be blank');
//
//// Validate email is not taken
//LeadSchema
//  .path('email')
//  .validate(function(value, respond) {
//    var self = this;
//    this.constructor.findOne({email: value}, function(err, user) {
//      if(err) throw err;
//      if(user) {
//        if(self.id === user.id) return respond(true);
//        return respond(false);
//      }
//      respond(true);
//    });
//}, 'The specified email address is already in use.');
//
//var validatePresenceOf = function(value) {
//  return value && value.length;
//};
//
///**
// * Pre-save hook
// */
//LeadSchema
//  .pre('save', function(next) {
//    if (!this.isNew) return next();
//
//    if (!validatePresenceOf(this.hashedPassword))
//      next(new Error('Invalid password'));
//    else
//      next();
//  });
//
///**
// * Methods
// */
//LeadSchema.methods = {
//  /**
//   * Authenticate - check if the passwords are the same
//   *
//   * @param {String} plainText
//   * @return {Boolean}
//   * @api public
//   */
//  authenticate: function(plainText) {
//    return this.encryptPassword(plainText) === this.hashedPassword;
//  },
//
//  /**
//   * Make salt
//   *
//   * @return {String}
//   * @api public
//   */
//  makeSalt: function() {
//    return crypto.randomBytes(16).toString('base64');
//  },
//
//  /**
//   * Encrypt password
//   *
//   * @param {String} password
//   * @return {String}
//   * @api public
//   */
//  encryptPassword: function(password) {
//    if (!password || !this.salt) return '';
//    var salt = new Buffer(this.salt, 'base64');
//    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
//  }
//};

module.exports = mongoose.model('Lead', LeadSchema);
