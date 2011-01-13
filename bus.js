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
	var callbacks = subscribers[env.name];
	if(callbacks) {
		callbacks.forEach(function(cb) {
			cb(serializer.deserialize(env.message));
		});
	}
};
	
var publish = function(msg) {
	var envelope = {
				name: msg.name,
				message : serializer.serialize(msg)
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
