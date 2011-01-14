var bus = require('./bus');

bus.ready(function() {
	bus.subscribe('url:messages', function(msg){
		console.log(msg);
	});
});
