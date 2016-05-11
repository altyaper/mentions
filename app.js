'use strict';

var express = require('express'),
    app = express(),
    port = process.env.PORT || 5000,
    http = require('http').Server(app),
    io = require('socket.io')(http),
    path = require('path'),
    keys = require('./config'),
    favicon = require('serve-favicon'),
    routes = require('./routes/subs'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    Instagram = require('./config/instagram.config'),
    Twitter = require('./config/twitter.config'),
    hashtags = require("./config/hashtags"),
    stream = Twitter.stream;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.set('port', port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use('/', routes);

io.on("connection", function(socket){

  stream.on('tweet', function (tweet) {
    socket.emit("new tweet",tweet);
  });

  for(var i = 0; i < hashtags.length; i++){
    var hash = hashtags[i].split("#")[1];
    Instagram.tags.recent({
       name: hash,
       complete: function(data) {
         socket.emit('first', { firstShow: data });
       }
    });

    Twitter.T.get('search/tweets', { q: hash, count: 10 }, function(err, data, response) {
      if(!err)
        socket.emit("first tweets",data);
    });

  }

});

app.get("/",function(req,res){
  res.render("index",{ title: "Monitoreo de redes" });
});


//here we will make a handshake with instagram
app.get('/callback', function(req, res){
    Instagram.subscriptions.handshake(req, res);
});

// //Everytime Instagram do a post request to our server
// app.post("/callback",function(req,res){
//   var data = req.body;
//   data.forEach(function(tag) {
//       var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+keys.instagram.i_client_id;
//       io.sockets.emit('show', { show: url });
//     });
//   res.end();
// });

// app.get('/oauth', function(request, response){
//   Instagram.oauth.ask_for_access_token({
//     request: request,
//     response: response,
//     redirect: keys.instagram.i_callback_url, // optional
//     complete: function(params, response){
//       console.log(params['access_token']);
//       console.log(params['user']);
//       response.writeHead(200, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       console.log("hi");
//       response.end();
//     },
//     error: function(errorMessage, errorObject, caller, response){
//       // errorMessage is the raised error message
//       // errorObject is either the object that caused the issue, or the nearest neighbor
//       // caller is the method in which the error occurred
//       response.writeHead(406, {'Content-Type': 'text/plain'});
//       // or some other response ended with
//       console.log("no");
//       response.end();
//     }
//   });
//   return null;
// });



http.listen(port, function(){
  console.log("Listening on *:"+port);
});

module.exports = app;
