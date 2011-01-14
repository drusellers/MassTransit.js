var serializer = require('./serializer'),
		transport = require('./transports/amqp'),
		subscribers = {},
		isReady = false,
		readyCallback;

var callbackIfReady = function() {
	if(isReady && readyCallback) {
		readyCallback();
	}
};

var deliver = function(env) {
	var message = JSON.parse(env.data),
			callbacks = subscribers[message.MessageType];
	if(callbacks) {
		callbacks.forEach(function(cb) {
			cb(serializer.deserialize(message.Message));
		});
	}
};
	
var publish = function(msg) {
	var envelope = {
				MessageType: msg.MessageType,
				Message: serializer.serialize(msg)
			};
	transport.publish(envelope);
};
	
var ready = function(callback) {
	readyCallback = callback;
	callbackIfReady();
};

var subscribe = function (messageName, callback) {
	subscribers[messageName] = subscribers[messageName] || [];
	subscribers[messageName].push(callback);
	transport.bind(messageName);
};


transport.addListener('open', function() {
	isReady = true;
	callbackIfReady();
});

transport.addListener('messageReceived', deliver);

transport.open();


module.exports.deliver = deliver;
module.exports.publish = publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
