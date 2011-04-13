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
  'when transport is ready': {
    topic: function() {
      var bus = require('../lib/bus')
      bus.ready(this.callback);
      bus.init({
        transport: 'memory'
      });
    },

    'should be ready': verify.wasCalled
  }
});


suite.export(module);
