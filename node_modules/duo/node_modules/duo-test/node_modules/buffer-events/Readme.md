
## buffer-events

  Buffer node's `EventEmitter` events until `flush()` is called.

### Example

      var buffer = require('buffer-events');
      var Emitter = require('events').EventEmitter;

      var emitter = new Emitter;
      var flush = buffer(emitter);

      emitter.on('foo', log);
      emitter.emit('foo', 'baz');

      flush(); // => "baz"

### License

  (MIT)
