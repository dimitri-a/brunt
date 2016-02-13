/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var lead = require('./salesleads.model');

exports.register = function(socket) {
  lead.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  lead.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('thing:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('thing:remove', doc);
}
