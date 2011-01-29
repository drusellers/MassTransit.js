var http = require('http'),  
    io = require('socket.io'),
    evented = require('eventedsocket'),
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
var clients = [];
socket.on('connection', function(client) { 
  var eClient = evented.client(client);
  eClient.on('message', function() {
    console.log('message');
  });

  eClient.on('disconnect', function() {
    console.log('disconnect');
  });

  //eClient.emit('a:newSubscription', { hi: 'from me' });
  clients.push(eClient);
}); 

bus.ready(config, function() {
  bus.subscribe('Diagnostics', function(m) {
    console.log(m);
    clients.forEach(function(client) {
      client.emit('a:busCreated', m);
    //socket.broadcast('a:busCreated', m);
    //socket.broadcast('a:newSubscription', m);
    });
  });
});
