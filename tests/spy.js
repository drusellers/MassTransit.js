var Emitter = require('events').EventEmitter;

module.exports = exports = new Emitter();

exports.init = function spyInit() {
  exports.initialized = true;
  exports.emit('ready');
};
