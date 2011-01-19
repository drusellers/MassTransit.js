var serializer = require('./serializer');

var wrap = function(messageType, message) {
	return {
		MessageType: messageType,
 		Message: serializer.serialize(message)
	};
};


module.exports.wrap = wrap;
