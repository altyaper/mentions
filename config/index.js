//Twitter Keys
var twitterKeys = {
    consumer_key         : process.env.t_consumer_key;
    consumer_secret      : process.env.t_consumer_secret;
    access_token         : process.env.t_access_token;
    access_token_secret   : process.env.t_access_token_secret;
};

//Instagram Keys
var instagramKeys = {
  i_client_id     : process.env.i_client_id;
  i_client_secret : process.env.i_client_secret;
  i_callback_url  : process.env.i_callback_url;
  i_access_token  : process.env.i_access_token;
};

var keys = {
  twitter: twitterKeys,
  instagram: instagramKeys
};

module.exports = keys;
