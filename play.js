var bus = require('./bus');

bus.ready(function() {
	bus.subscribe('ping', function(msg){
		console.log('yo ' + msg.name);
	});

	bus.publish({name:'ping'});
});
