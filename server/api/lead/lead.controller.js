'use strict';

var Lead = require('./lead.model.js');
var config = require('../../config/environment');
var json2csv = require('json2csv');
var path = require('path');
var mime = require('mime');
var fs = require('fs');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

// Get list of things
/*exports.index = function(req, res) {
  Lead.find(function (err, leads) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(leads);
  });
};*/

exports.index = function(req, res) {
  Lead.find(function (err, leads) {
    if(err) { return handleError(res, err); }
    console.log("printing the res " , leads);

    var fields = ['name', 'address', 'dob', 'phone', 'mobile', 'email', 'note', 'consent'];

    var data = leads;
    json2csv({ data: leads, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      console.log("printing the csv " + csv);
      fs.writeFile('file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');
        return res.status(200).json(leads);
      });
    });
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {

  console.log("inside exports.create " + req.body);
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
/*exports.generateCsv = function (req, res, next) {
  console.log("inside the generateCsv..");



  Lead.find(function (err, leads) {
    if(err) { return handleError(res, err); }
    console.log("printing the res " , leads);

    var fields = ['name', 'address', 'phone', 'mobile', 'email'];

    var data = leads;
    json2csv({ data: leads, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      console.log("printing the csv " + csv);
      fs.writeFile('file.csv', csv, function(err) {
        if (err) throw err;
        console.log('file saved');

        var file = 'file.csv';


        return res.download(file);

      });

    });

  });
};*/

exports.generateCsv = function (req, res, next) {
  console.log("inside the generateCsv..");
  var file = 'file.csv';
  return res.download(file);
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
