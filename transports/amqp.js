var amqp = require('amqp'),
		events = require('events'),
		emitter = new events.EventEmitter(),
		con,
		queue,
		exchanges = {},
		waitingMessage;

var bind = function(exchangeName) {
	var exchange = con.exchange(exchangeName, { durable: true, type: 'fanout' });
	exchange.addListener('open', function() {
		queue.bind(exchangeName, '');
		exchanges[exchangeName] = exchange;
		if(waitingMessage) {
			publish(waitingMessage);
			waitingMessage = undefined;
		}
	});
};

var close = function() {
	con.close();
};

var open = function() {
	con = amqp.createConnection({ host: '0.0.0.0' });
	con.addListener('ready', function() {
		queue = con.queue('node', { durable: true }, function() {
			emitter.emit('open');
			queue.subscribe(function(message){
				emitter.emit('messageReceived', message);
			});
		});
	});
};

var publish = function(message) {
	var namedExchange = exchanges[message.name];
	if(namedExchange) {
		namedExchange.publish('', message);
	} else {
		waitingMessage = message;
	}
};

emitter.bind = bind;
emitter.close = close;
emitter.open = open;
emitter.publish = publish;

module.exports = emitter;
