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
  publish('Diagnostics', {
    MessageType: messageName,
    Subscriber: callback.toString()
  });
};


module.exports.publish = bus.publish;
module.exports.ready = ready;
module.exports.subscribe = bus.subscribe;
