var amqp = {
	
	open : function() {
		a = require('/usr/local/lib/node/amqp');
		this.conn = a.createConnection({host:'0.0.0.0'});
		this.queue = this.conn.queue('nodejs',{durable:true});
	},
	
	close : function() {
		this.conn.end();
	},
	
	bind : function(exchange)
	{
		//assuming a bind to a fanout exchnage
		this.queue.bind(exchange,'');
	},
	
	publish : function(message){
		exchange = message.name;
		ex=this.connection.exchange(exchange, {durable:true,type:'fanout'})
		ex.publish('', message)
	},
	
	monitor : function(deliver){
		this.queue.subscribe(function(message){
			deliver(message);
		});
	}
};

module.exports = amqp;