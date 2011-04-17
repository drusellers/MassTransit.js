var envelope = require('./envelope'),
		Emitter = require('events').EventEmitter,
		localBus = new Emitter(),
		delayedCommands = [],
		readyTransport,
		transport;

var deliver = function busDeliver(env) {
	var message = envelope.unwrap(env);
  localBus.emit(message.messageType, message.message);
};
	
var getTransport = function busGetTransport(transportName) {
  if(transportName.indexOf('/') === 0) {
    return require(transportName);
  }
  return require('./transports/' + transportName);
};

var init = function busInit(config) {
  transport = getTransport(config.transport);
  transport.on('ready', function() {
    readyTransport = transport;
    delayedCommands.forEach(function(command) {
      command();
    });
    localBus.emit('ready');
  });
  transport.on('message', deliver);
  transport.init(config);
};

var publish = function busPublish(messageType, message) {
	whenTransportReady(function() {
    transport.publish(envelope.wrap(messageType, message));
	});
};

var ready = function busReady(callback) {
  localBus.on('ready', callback);
};

var subscribe = function busSubscribe(messageName, callback) {
  localBus.on(messageName, callback);
  whenTransportReady(function() {
    transport.bind(messageName);
  });
};

var whenTransportReady = function busWhenTransportReady(command) {
	if(readyTransport) {
    command();
  } else {
    delayedCommands.push(command);
  }
};


exports.init = init;
exports.publish = publish;
exports.ready = ready;
exports.subscribe = subscribe;
