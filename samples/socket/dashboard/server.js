var http = require('http'),  
    io = require('socket.io'),
    connect = require('connect'),
    fs = require('fs'),
    config = require('./config'),
    bus = require('masstransit').create(),
    server = connect.createServer(
      connect.logger(),
      connect.staticProvider(__dirname + '/public')
    ),
    socket = io.listen(server); 

server.listen(8080);

socket.on('connection', function(client) { 
  console.log('client: ', client);
  client.on('disconnect', function() {
    console.log('disconnect');
  });
}); 

bus.ready(config, function() {
  bus.subscribe('Diagnostics', function(m) {
    socket.broadcast(m);
  });
});
