var keys = require("../config/index");
var Twitter = require('twit');
var hashtags = require("../config/hashtags");

var Twitter = new Twitter(keys.twitter);

//Stream this hashtags
var stream = Twitter.stream('statuses/filter', { track: hashtags });

var t = {
  T : Twitter,
  stream  : stream
};

module.exports = t;
