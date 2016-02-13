'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: String,
  venue: String
});

module.exports = mongoose.model('Event', EventSchema);
