require('should');
var app = require('../app');
var request = require('supertest');
var io = require('socket.io-client');
var socketURL = 'http://127.0.0.1:5000';

var options = {
    transports: ['websocket'],
    'force new connection': true
};

describe('Test events', function () {

  it('it should return some data after the first connection', function (done) {
    var client = io.connect(socketURL, options);
    client.on("first", function(data){
      data.firstShow.should.not.equal([]);
      client.disconnect();
      done();
    });
  });

  // it('it should POST in /callback', function (done) {
  //
  //   request(app)
  //     .post('/callback')
  //     .expect(200).end(function(){
  //       done();
  //     });
  //
  // });

  it('it should make a GET request to /callback', function (done) {
    request(app)
      .get('/callback')
      .expect(400, done);
  });

  it('it should reject two topics per request to a new subscription', function(done){
    request(app)
      .post('/subscription')
      .send({ topic: 'topic'})
      .expect(200).end(function(err, res){
        res.body.status.should.equal(200);
        if(!err){
          done();
        }
      });
  });

  it('it should responde 200 in /subscription route', function(done){
    request(app).get('/subscription').expect(200,done);
  });


});
