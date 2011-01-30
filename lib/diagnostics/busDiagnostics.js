var bus = require('../bus'),
    os = require('os'),
    id = require('node-uuid')();

var ready = function(config, callback) {
  bus.ready(config, function() {
    bus.publish('Diagnostics', {
      evt: 'bus:ready',
      hostName: os.hostname(),
      id: id,
      queueName: config.queueName,
      time: new Date()
    });
    callback();
  });
};

var subscribe = function (messageName, callback) {
  bus.subscribe(messageName, callback);
  bus.publish('Diagnostics', {
    evt: 'bus:subscriberRegistered',
    id: id,
    messageType: messageName,
    subscriber: callback.toString()
  });
};

process.on('exit', function() {
  bus.publish('Diagnostics', {
    evt: 'bus:exited',
    id: id,
    time: new Date()
  });
});

process.on('SIGINT', function() {
  process.exit();
});


module.exports.publish = bus.publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
