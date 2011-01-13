var bus = {
	
	subs : {},
	
	transport : require('./transports/amqp'),
	
	serializer : require("./serializer"),
	
	publish : function(msg)
	{
		msg_name = msg.name;
		var env = {
			MessageName : msg.name,
			Message : this.serializer.serialize(msg)
		}
		//push into the queue
		
	},
	
	deliver : function(env){
		backs = this.subs[env.messageName];
		if(backs != null)
		{
			backs.forEach(function(cb){
				cb(env.message);
			});
		}
	},
	
	subscribe : function (msg_name, callback)
	{
		backs = this.subs[msg_name];
		if(backs == null)
		{
			backs = [];
		}
		
		backs.push(callback);
		
		this.subs[msg_name] = backs;
	}
}
module.exports=bus;
