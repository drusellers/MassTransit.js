var serializer = require('./serializer'),
		subscribers = {},
		isReady = false,
		readyCallback;

var callbackIfReady = function() {
	if(isReady) {
		readyCallback();
	}
};

var deliver = function(env) {
	var callbacks = subscribers[env.messageName];
	if(callbacks) {
		callbacks.forEach(function(cb){
			cb(env.message);
		});
	}
};
	
var publish = function(msg) {
	var envelope = {
				messageName : msg.name,
				message : serializer.serialize(msg)
			};
		//push into the queue
};
	
var ready = function(callback) {
	readyCallback = callback;
	callbackIfReady();
};

var subscribe = function (msg_name, callback) {
	subscriptions[msg_name] = subscriptions[msg_name] || [];
	subscriptions[msg_name].push(callback);
};

module.exports.deliver = deliver;
module.exports.publish = publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
