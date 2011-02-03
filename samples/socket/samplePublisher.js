var bus = require('masstransit').create(true);
    config = require('./samplePublisherConfig');

bus.ready(config, function() {
  setTimeout(function() {
    bus.subscribe('CoffeeOrdered', function coffeeOrdered(m) {
      console.log('coffee ordered: ', m);
    });
  }, 3000);

  setTimeout(function() {
    bus.subscribe('CoffeeReceived', function coffeeReceived(m) {
      console.log('coffee received: ', m);
    });
  }, 6000);
});
