(function() {
  var subscribers = {};

  var publish = function(evt, message) {
    subscribers[evt].forEach(function(subscriber) {
      subscriber(message);
    });
  };

  var subscribe = function(evt, handler) {
    subscribers[evt] = subscribers[evt] || [];
    subscribers[evt].push(handler);
  };

  if(window.jQuery) {
    $.publish = publish;
    $.subscribe = subscribe;
  }

  if(window.Wagner) {
    Wagner.compose('pubsub', function() {
      this.publish = publish;
      this.subscribe = subscribe;
    });
  }
})();
