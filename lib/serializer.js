var serializer = {
	
	serialize : function(msg) {
		return JSON.stringify(msg);
	},
	
	deserialize : function(data){
		return JSON.parse(data);
	}
}

module.exports = serializer;