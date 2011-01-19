var bus = require('masstransit'),
		config = require('./sampleSubscriberConfig');

bus.ready(config, function() {
	bus.subscribe('Tosca.Messages.CreateReservation', function(msg) {
		console.log(msg);
		bus.publish('Tosca.Messages.ReservationConfirmed', msg);
	});
});

