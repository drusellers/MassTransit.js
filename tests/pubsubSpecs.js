var vows = require('vows'),
    assert = require('assert'),
    suite = vows.describe('A bus');

var verify = function(actual) {
  return {
    shouldBe: function(assertion, expected) {
      if(assertion === 'true') {
        assert.equal(actual, true);
      } else {
        assert[assertion](actual, expected);
      }
    }
  };
};

verify.wasCalled = function() {
  assert.isTrue(true);
};

suite.addBatch({
  'when subscribing to an event': {
    topic: function() {
      var bus = require('../lib/bus'),
          self = this;
      bus.init({
        transport: 'memory'
      });
      bus.subscribe('testEvent', function(message) {
        self.callback(null, message);
      });
      bus.publish('testEvent', 'message');
    },

    'should be notified when event is published': function(err, message) {
      verify(message).shouldBe('equal', 'message');
    }
  }
});


suite.export(module);
