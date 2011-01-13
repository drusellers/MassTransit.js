sys = require('sys');
bus = require('./bus');

bus.subscribe('ping', function(msg){
	sys.puts('hi fucker ' + msg.name);
});

bus.publish({name:'ping'});

a = require('/usr/local/lib/node/amqp');
c = a.createConnection({host:'0.0.0.0'});
//q = c.queue('node', {durable:true});
//e = c.exchange('nodeex', {durable:true,type:'fanout'});
//q.bind('nodeex','');
//c.end();