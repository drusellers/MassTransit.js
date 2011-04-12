var vows = require('vows'),
    assert = require('assert'),
    suite = vows.describe('A bus');

var verify = function(actual) {
  return {
    should: function(assertion, expected) {
      assert[assertion](actual, expected);
    }
  };
};

verify.wasCalled = function() {
  assert.isTrue(true);
};

suite.addBatch({
  'when initialized properly': {
    topic: function() {
      var bus = require('../lib/bus')
      bus.ready(this.callback);
      bus.init({
        
      });
    },

    'should be ready': verify.wasCalled
  }
});

suite.run();
