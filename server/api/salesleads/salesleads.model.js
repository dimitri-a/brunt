'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SalesLeadSchema = new Schema({
  name: String,
  address: String,
  phone: Number,
  mobile: Number,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'lead'
  },
  provider: String,
  salt: String
});

// Public profile information
SalesLeadSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
SalesLeadSchema
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
SalesLeadSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');


// Validate empty address
SalesLeadSchema
  .path('address')
  .validate(function(address) {
    return address.length;
  }, 'Address cannot be blank');


// Validate empty address
SalesLeadSchema
  .path('phone')
  .validate(function(phone) {
    return phone;
  }, 'Phone cannot be blank');


// Validate empty address
SalesLeadSchema
  .path('mobile')
  .validate(function(mobile) {
    return mobile;
  }, 'Mobile cannot be blank');


// Validate empty email
SalesLeadSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');



// Validate email is not taken
SalesLeadSchema
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
SalesLeadSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
  });

module.exports = mongoose.model('SalesLeadSchema', SalesLeadSchema);
