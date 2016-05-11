var express = require('express');
var router = express.Router();
var keys = require("../config/index");
var Client = require('node-rest-client').Client;
var Instagram = require('../config/instagram.config');
var client = new Client();
var MAX_NUM_OF_TOPICS = 1;

router.route("/subscriptions")
  .get(function(req,res){
    var url = "https://api.instagram.com/v1/subscriptions?client_secret="+keys.instagram.i_client_secret+"&client_id="+keys.instagram.i_client_id;
    client.get(url,function(data, response){
    res.render("subscriptions", {data: data.data});
  });
});


router.route("/subscription")
  .get(function(req,res){

    res.render("subscription");

  }).post(function(req, res){

    if(Object.keys(req.body).length === MAX_NUM_OF_TOPICS && req.body.topic !== undefined){

      // Instagram.tags.subscribe({
      //   object: 'tag',
      //   object_id: req.body.topic,
      //   aspect: 'media',
      //   callback_url: keys.instagram.i_callback_url,
      //   type: 'subscription',
      //   id: '#'
      // });

      res.status(200).json({
        status: 200,
        message: "Nuevo tema agregado",
        topic: req.body.topic
      });

    }else{
      res.status(201).end();
    }
  });;


module.exports = router;
