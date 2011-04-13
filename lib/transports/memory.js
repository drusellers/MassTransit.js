var Emitter = require('events').EventEmitter;
exports = new Emitter();
module.exports = exports;

var bind = function memoryBind() {
};

var init = function memoryInit() {
  exports.emit('ready');
};

var publish = function memoryPublish(message) {
  exports.emit('message', message);
};


exports.bind = bind;
exports.init = init;
exports.publish = publish;
