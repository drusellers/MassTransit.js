var amqp = require('amqp'),
		exch,
		exchangeIsReady = false,
		q,
		queueIsReady = false,
		isReady = false,
		readyCallback;

//configElement
var con = amqp.createConnection({ host: '0.0.0.0' });

var attemptBind = function() {
	if(queueIsReady && exchangeIsReady) {
		isReady = true;
		q.bind('nodeex', '');
		callbackIfReady();
	}
};

var callbackIfReady = function() {
	if(isReady && readyCallback) {
		readyCallback();
	}
};

var onMessageDelivered = function(deliverCallback) {
	q.subscribe(deliverCallback);
};

var publish = function(msg) {
	exch.publish('', msg);
};

var ready = function(callback) {
	readyCallback = callback;
	callbackIfReady();
};

con.addListener('ready', function() {
	exch = con.exchange('nodeex', { durable: true, type: 'fanout' });
	q = con.queue('node', { durable: true }, function() {
		queueIsReady = true;
		attemptBind();
	});

	exch.addListener('open', function() {
		exchangeIsReady = true;
		attemptBind();
	});
});


module.exports.onMessageDelivered = onMessageDelivered;
module.exports.publish = publish;
module.exports.ready = ready;
