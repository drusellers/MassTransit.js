var http = require('http'),  
    io = require('socket.io'),
    evented = require('eventedsocket'),
    fs = require('fs'),
    config = require('./socketSampleConfig'),
    bus = require('masstransit'),
    server = http.createServer(function(req, res) { 
      if(req.url === '/') {
        res.writeHeader(200, {'Content-Type': 'text/html'}); 
        fs.readFile(__dirname + '/socketclient.html', function(err, file) {
          res.end(file.toString()); 
        });
      } else if(req.url.indexOf('.js') !== -1) {
        res.writeHeader(200, {'Content-Type': 'text/javascript'}); 
        fs.readFile(__dirname + req.url, function(err, file) {
          res.end(file.toString()); 
        });
      } else {
        res.writeHeader(404);
        res.end();
      }
    }),
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
