var bus = require('masstransit');

bus.ready(function() {
	bus.subscribe('Tosca.Messages.CreateReservation', function(msg) {
	console.log(msg);
		bus.publish({ MessageType: 'Tosca.Messages.ReservationConfirmed', Name: msg.Name });
	});
});
