if (typeof JSON === 'undefined') {
  throw new Error('Eventedsocket: Ouch! I need json.js! You know my main purpose is sending json over the wire, don\'t you?');
}

(function (global) {

  /* custom event regex */ 
  var customEventRegex = /^\w+:\w+$/;

  /* custom event json prefix */
  var customEventJsonPrefix = '~e~';

  /* regex matching custom event jsons */
  var customEventJsonRegex = new RegExp('^' + customEventJsonPrefix);

  /**
   * Handle each message key as custom event
   */
  function handleMsg(eventHandlers, msg) {
    var e;
    for (e in msg) {
      if (msg.hasOwnProperty(e)) { 
  handle(eventHandlers, e, msg[e]);
      }
    }
  }

  /**
   * Fire handlers for each custom event
   */
  function handle (eventHandlers, e, data) {
    var handlers = eventHandlers[e];
    if (handlers) {
      handlers.forEach(function (handler) {
  handler(data);
      });
    }
  }

  /**
   * Attach handler for custom event
   */
  function on (eventHandlers, e, f) {
    var handlers = eventHandlers[e];
    if (!handlers) {
      handlers = eventHandlers[e] = [];
    }
    handlers.push(f);
  }

  /**
   * Format custom event message with associated data
   */
  function format (e, data) {
    return customEventJsonPrefix + '{"' + e + '":' + JSON.stringify(data) + '}';
  }

  /**
   * Emit custom event across the wire
   */
  function emit (e, data) {
    this.send(format(e, data));
  }
  
  /**
   * Overrides method to hijack custom events
   */
  function override (func, customEventHandler) {

    return function (e) {
      if (customEventRegex.test(e)) {
  customEventHandler.apply(this, arguments);
      }
      else {
  func.apply(this, arguments);
      }
    };
  } 

  /**
   * Add custom events to socket
   */
  global.socket = function (socket) {

    var oldBroadcast = socket.broadcast;
    if (oldBroadcast) { 
      socket.broadcast = override(oldBroadcast, function (e, data) {
  oldBroadcast.call(socket, format(e, data));
      });
    }

    /* todo - add on-handler */

    return socket;    
  };

  /**
   * Add custom events to clients
   */
  global.client = function (client) {

    /* client local eventHandlers */
    var eventHandlers = {};

    /* override emit method to handle custom events */
    var oldEmit = client.emit;
    client.emit = override(oldEmit, function () {
      emit.apply(this, arguments);
    });

    /* override on method to handle custom events */
    var oldOn = client.on;
    client.on = override(oldOn, function () {
      on.apply(this, [eventHandlers].concat(Array.prototype.slice.apply(arguments)));
    });

    /* override broadcast to handle custom events */
    var oldBroadcast = client.broadcast;
    if (oldBroadcast) {
      client.broadcast = override(oldBroadcast, function (e, data) {
  var socket = client.listener;
  var clients = socket.clients;
  var c, sessionId;
  if (typeof data === 'function') {
    for (sessionId in socket.clients) {
      c = clients[sessionId];
      var d = data(c) || '';
      emit.call(c, e, d); 
    }  
  } else {
    var f = format(e, data);
    socket.broadcast.call(socket, f);
  }
      });
    }

    /* handle custom event messages */
    client.on('message', function (json) {
      if (!customEventJsonRegex.test(json)) {
  return;
      }

      try {
  json = json.replace(customEventJsonRegex, '');
  handleMsg(eventHandlers, JSON.parse(json));
      }
      catch (err) {
  throw new Error('Eventedclient: Couldn\'t parse json message. Got ' + err + ' while parsing message ' + json);
      }
    });

    return client;
  };

})( 
  typeof window === 'undefined' 
    ? module.exports 
    : ( window.evented = {} )
);
