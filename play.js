var sys = require('sys'),
		bus = require('./bus'),
		amqp = require('amqp');

//bus.subscribe('ping', function(msg){
	//sys.puts('hi fucker ' + msg.name);
//});

//bus.publish({name:'ping'});

var con = amqp.createConnection({ host: '0.0.0.0' });

con.addListener('ready', function() {
	console.log('connection ready');
	var exch = con.exchange('nodeex', { durable: true, type: 'fanout' }),
			q = con.queue('node', { durable: true }, function() {
				console.log('queue open');
				
				q.bind('nodeex', '');
				q.subscribe(function(msg) {
					console.log('hi fucker, here is your message:');
					console.log(msg);
				});
				exch.publish('', { name: 'dru', message: 'is da man' });
			});

	exch.addListener('open', function() {
		console.log('exchange open');
		exch.publish('', { name: 'dru', message: 'is da man' });
	});
});
