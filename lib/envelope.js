var serializer = require('./serializer');

var unwrap = function(envelope) {
	return {
		message: serializer.deserialize(envelope.Message),
		messageType: envelope.MessageType
	};
};

var wrap = function(messageType, message) {
	return {
 		Message: serializer.serialize(message),
		MessageType: messageType
	};
};


module.exports.unwrap = unwrap;
module.exports.wrap = wrap;
