'use strict';

var Lead = require('./salesleads.model.js');
var config = require('../../config/environment');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

// Get list of things
exports.index = function(req, res) {
  Lead.find(function (err, leads) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(leads);
  });
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
 * Creates a new user
 */
exports.generateCsv = function (req, res, next) {
  var json2csv = require('json2csv');
  var fields = ['field1', 'field2', 'field3'];

  Lead.find(function (err, leads) {
    if(err) { return handleError(res, err); }

    json2csv(res, function(err, csv) {
      if (err) console.log(err);
      console.log(csv);
      return res.status(200).json(leads);
    });

  });
};
/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
