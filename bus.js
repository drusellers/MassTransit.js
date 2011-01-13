var serializer = require('./serializer'),
		amqp = require('amqp'),
		subscribers = {},
		isReady = false,
		readyCallback,
		q,
		queueIsReady = false,
		exch,
		exchangeIsReady = false;

var callbackIfReady = function() {
	if(isReady && readyCallback) {
		readyCallback();
	}
};

var deliver = function(env) {
	var callbacks = subscribers[env.messageName];
	if(callbacks) {
		callbacks.forEach(function(cb){
			cb(serializer.deserialize(env.message));
		});
	}
};
	
var publish = function(msg) {
	var envelope = {
				messageName : msg.name,
				message : serializer.serialize(msg)
			};
	exch.publish('', envelope);
};
	
var ready = function(callback) {
	readyCallback = callback;
	callbackIfReady();
};

var subscribe = function (msg_name, callback) {
	subscribers[msg_name] = subscribers[msg_name] || [];
	subscribers[msg_name].push(callback);
};



//configElement
var con = amqp.createConnection({ host: '0.0.0.0' });
var attemptBind = function() {
	if(queueIsReady && exchangeIsReady) {
		isReady = true;
		q.bind('nodeex', '');
		callbackIfReady();
	}
};

con.addListener('ready', function() {
	exch = con.exchange('nodeex', { durable: true, type: 'fanout' });
	q = con.queue('node', { durable: true }, function() {
		queueIsReady = true;
		attemptBind();
		q.subscribe(deliver);
	});

	exch.addListener('open', function() {
		exchangeIsReady = true;
		attemptBind();
	});
});

module.exports.deliver = deliver;
module.exports.publish = publish;
module.exports.ready = ready;
module.exports.subscribe = subscribe;
