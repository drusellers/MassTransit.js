var envelope = require('./envelope'),
		Emitter = require('events').EventEmitter,
		localBus = new Emitter(),
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
    localBus.emit('ready');
  });
  transport.on('message', deliver);
  transport.init(config);
};

var publish = function busPublish(messageType, message) {
	transport.publish(envelope.wrap(messageType, message));
};

var ready = function busReady(callback) {
  localBus.on('ready', callback);
};

var subscribe = function busSubscribe(messageName, callback) {
  localBus.on(messageName, callback);
	transport.bind(messageName);
};


exports.init = init;
exports.publish = publish;
exports.ready = ready;
exports.subscribe = subscribe;
