var keys = require("../config/index");
var Instagram = require('instagram-node-lib');
var hashtags = require('../config/hashtags');

Instagram.set('client_id', keys.instagram.i_client_id);
Instagram.set('client_secret', keys.instagram.i_client_secret);
Instagram.set('callback_url', keys.instagram.i_callback_url+'/callback');
Instagram.set('redirect_uri', keys.instagram.i_callback_url);
Instagram.set("access_token",keys.instagram.i_access_token);
Instagram.set('maxSockets', 10);

// for(var i = 0; i < hashtags.length; i++){
//  var hash = hashtags[i].split("#")[1];
//  Instagram.tags.subscribe({
//    object: 'tag',
//    object_id: hash,
//    aspect: 'media',
//    callback_url: keys.instagram.i_callback_url,
//    type: 'subscription',
//    id: '#'
//  });
// }

module.exports = Instagram;
