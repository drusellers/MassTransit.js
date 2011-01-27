var bus = require('../bus'),
    os = require('os');

var ready = function(config, callback) {
  bus.ready(config, function() {
    bus.publish('Diagnostics', {
      hostName: os.hostname(),
      queueName: config.queueName
    });
    callback();
  });
};

var subscribe = function (messageName, callback) {
  bus.subscribe(messageName, callback);
  bus.publish('Diagnostics', {
    MessageType: messageName,
    Subscriber: callback.toString()
  });
};

process.on('exit', function() {
  bus.publish('Diagnostics', {
    messageType: 'exiting'
  });
});

process.on('SIGINT', function() {
  process.exit();
});


module.exports.publish = bus.publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
