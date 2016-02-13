'use strict';

var express = require('express');
var controller = require('./lead.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.get('/csv', controller.generateCsv);

module.exports = router;
