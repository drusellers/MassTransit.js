var serializer = require('./serializer'),
		transport = require('./transports/amqpTransport'),
		subscribers = {},
		isReady = false,
		readyCallback;

var callbackIfReady = function() {
	if(isReady && readyCallback) {
		readyCallback();
	}
};

var deliver = function(env) {
	var callbacks = subscribers[env.messageName];
	if(callbacks) {
		callbacks.forEach(function(cb) {
			cb(serializer.deserialize(env.message));
		});
	}
};
	
var publish = function(msg) {
	var envelope = {
				messageName : msg.name,
				message : serializer.serialize(msg)
			};
	transport.publish(envelope);
};
	
var ready = function(callback) {
	readyCallback = callback;
	callbackIfReady();
};

var subscribe = function (msg_name, callback) {
	subscribers[msg_name] = subscribers[msg_name] || [];
	subscribers[msg_name].push(callback);
};


transport.ready(function() {
	isReady = true;
	transport.onMessageDelivered(deliver);
	callbackIfReady();
});


module.exports.deliver = deliver;
module.exports.publish = publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
