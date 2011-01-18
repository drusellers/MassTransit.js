var bus = require('masstransit'),
		config = require('./sampleSubscriberConfig');

bus.ready(config, function() {
	bus.subscribe('Tosca.Messages.CreateReservation', function(msg) {
		console.log(msg);
		bus.publish({ MessageType: 'Tosca.Messages.ReservationConfirmed', Name: msg.Name });
	});
});
