var amqp = require('amqp'),
		events = require('events'),
		emitter = new events.EventEmitter(),
		con,
		queue,
		exchanges = {};

var createPendingExchange = function(exchangeName) {
	var exchange = con.exchange(exchangeName, { durable: true, type: 'fanout' }),
			waitingMessages = [],
			that = new events.EventEmitter();

	var publish = function(route, message) {
		waitingMessages.push({
			route: route,
			message: message
		});
	};

	exchange.addListener('open', function() {
		that.emit('open');
		exchanges[exchangeName] = exchange;
		waitingMessages.forEach(function(m) {
			exchange.publish(m.route, m.message);
		});
	});

	that.publish = publish;

	return that;
};

var bind = function(exchangeName) {
	exchanges[exchangeName] = exchanges[exchangeName] || createPendingExchange(exchangeName);
	exchanges[exchangeName].addListener('open', function() {
		queue.bind(exchangeName, '');
	});
};

var close = function() {
	con.close();
};

var open = function() {
	con = amqp.createConnection({ host: '0.0.0.0' });
	con.addListener('ready', function() {
		queue = con.queue('bmavity', { durable: true }, function() {
			emitter.emit('open');
			queue.subscribe(function(message){
				emitter.emit('messageReceived', message);
			});
		});
	});
};

var publish = function(message) {
	var exchangeName = message.MessageType;
	exchanges[exchangeName] = exchanges[exchangeName] || createPendingExchange(exchangeName);
	var namedExchange = exchanges[exchangeName];
			
	namedExchange.publish('', message);
};

emitter.bind = bind;
emitter.close = close;
emitter.open = open;
emitter.publish = publish;

module.exports = emitter;
