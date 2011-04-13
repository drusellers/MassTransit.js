var Emitter = require('events').EventEmitter;
exports = new Emitter();
module.exports = exports;

var init = function memoryInit() {
  exports.emit('ready');
};


exports.init = init;
