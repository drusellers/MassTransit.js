var envelope = require('./envelope'),
		subscribers = {},
		transport,
		isReady = false,
		readyCallback;

var callbackIfReady = function() {
	if(isReady && readyCallback) {
		readyCallback();
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
	
var ready = function(config, callback) {
	initializeTransport(config);
	readyCallback = callback;
	callbackIfReady();
};

var subscribe = function (messageName, callback) {
	subscribers[messageName] = subscribers[messageName] || [];
	subscribers[messageName].push(callback);
	transport.bind(messageName);
};


module.exports.publish = publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
