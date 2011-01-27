var bus = require('masstransit'),
    config = require('./samplePublisherConfig');

bus.ready(config, function() {
  bus.subscribe('CoffeeOrdered', function coffeeOrdered(m) {
    console.log('coffee ordered: ', m);
  });

  bus.subscribe('CoffeeReceived', function coffeeReceived(m) {
    console.log('coffee received: ', m);
  });
});
