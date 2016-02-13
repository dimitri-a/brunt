'use strict';

var express = require('express');
var controller = require('./salesleads.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.get('/csv', controller.generateCsv);

module.exports = router;
