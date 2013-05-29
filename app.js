var http = require('http');
var express = require('express');
var ts = require('twitter-stream');
var io = require('socket.io')
var app = express();
var server = http.createServer(app);
var peersConnected = 0;
var stream;

server.listen(1337);
io = io.listen(server);

app.use(express.logger());
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket){
  if(!peersConnected++){
    stream = ts.connect({
      screen_name: process.argv[2],
      password: process.argv[3],
      action: 'sample'
    });

    stream.on('status', function(status){
      if(status.geo){
        io.sockets.emit('tweets', {
          coordinates: status.geo.coordinates,
          text: status.text
        });
      }
    });

    stream.on('error', function(error){
      console.error(error);
    });
  }

  socket.on('disconnect', function(){
    if(!--peersConnected){
      stream.abort();
    }
  });
});
