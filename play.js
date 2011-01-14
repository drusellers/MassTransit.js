var bus = require('./bus');

bus.ready(function() {
	bus.subscribe('ping', function(msg){
		console.log('yo ' + msg.name);
	});

	bus.subscribe('ping', function(msg) {
		console.log('two ' + msg.name);
	});

	bus.subscribe('pong', function(msg) {
		console.log('pong received');
		console.log(msg);
	});

	bus.publish({ name:'ping' });
	bus.publish({ name: 'pong', val: '28092' });
});
