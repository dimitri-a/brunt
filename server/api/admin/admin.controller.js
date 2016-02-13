'use strict';

var Lead = require('./admin.model.js');
var config = require('../../config/environment');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newLead = new Lead(req.body);
  newLead.provider = 'local';
  newLead.role = 'lead';
  newLead.save(function(err, lead) {
    if (err) {
      return validationError(res, err);
    };

    return res.status(200).json(lead);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
