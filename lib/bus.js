var envelope = require('./envelope'),
		subscribers = {},
		transport,
		isReady = false,
		readyCallbacks = [],
		Emitter = require('events').EventEmitter,
		localBus = new Emitter();

var callbackIfReady = function() {
	if(isReady && readyCallbacks.length) {
		readyCallbacks.forEach(function(readyCallback) {
		  readyCallback();
		});
		readyCallbacks = [];
	}
};

var deliver = function(env) {
	var message = envelope.unwrap(env),
			callbacks = subscribers[message.messageType];
	if(callbacks) {
		callbacks.forEach(function(cb) {
			cb(message.message);
		});
	}
};
	
var initializeTransport = function(config) {
	transport = require('./transports/' + config.transport);
	transport.open(config);

	transport.addListener('open', function() {
		isReady = true;
		callbackIfReady();
	});

	transport.addListener('messageReceived', deliver);
};

var publish = function(messageType, message) {
	transport.publish(envelope.wrap(messageType, message));
};
	
var subscribe = function (messageName, callback) {
	subscribers[messageName] = subscribers[messageName] || [];
	subscribers[messageName].push(callback);
	transport.bind(messageName);
};


module.exports.publish = publish;
module.exports.subscribe = subscribe;

var init = function busInit(config) {
  localBus.emit('ready');
};

var ready = function busReady(callback) {
  localBus.on('ready', callback);
};


exports.init = init;
exports.ready = ready;
