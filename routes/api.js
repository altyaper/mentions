var express = require('express');
var router = express.Router();
var keys = require('../config');
var Twit = require('twit');
var Instagram = require('instagram-node-lib');
var T = new Twit(keys.twitter);


module.exports = router;
