
var Emitter = require('events').EventEmitter;
var assert = require('assert');
var buffer = require('./');

describe('buffer-events', function(){
  var args = [];

  beforeEach(function(){
    args = [];
  });

  function push(){
    args.push([].slice.call(arguments));
  }

  it('should buffer events', function(){
    var emitter = new Emitter;
    var flush = buffer(emitter);
    emitter.on('a', push);
    emitter.on('b', push);
    emitter.on('c', push);
    emitter.emit('a', [1, 2, 3]);
    emitter.emit('b', 1, 2, 3);
    emitter.emit('noop', {});
    emitter.emit('c', {});
    assert.equal(0, args.length);
    flush();
    emitter.emit('c', {});
    assert.equal(4, args.length);
    assert.deepEqual(args[0], [[1, 2, 3]]);
    assert.deepEqual(args[1], [1, 2, 3]);
    assert.deepEqual(args[2], [{}]);
    assert.deepEqual(args[3], [{}]);
  })
})
