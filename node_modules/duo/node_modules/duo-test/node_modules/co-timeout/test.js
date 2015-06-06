
var assert = require('assert');
var wait = require('co-wait');
var timeout = require('./');
var ms = require('ms');

describe('co-timeout', function(){
  it('should timeout correctly', function*(){
    var msg;

    try {
      yield timeout('50ms', wait(100));
    } catch (e) {
      msg = e.message;
    }

    assert.equal(msg, 'timeout of "50" reached');
  });

  it('should not error if timeout was not reached', function*(){
    yield timeout('50ms', wait(10));
  })

  it('should return the value', function*(){
    var val = yield timeout('50ms', values(1));
    assert.deepEqual([1], val);
  })

  it('should support generators', function*(){
    var vals = yield timeout('50ms', values(1, 2));
    assert.deepEqual([1, 2], vals);
  })

  it('should accept numbers', function*(){
    var vals = yield timeout(50, values(1, 2));
    assert.deepEqual([1, 2], vals);
  });
})

function *values(){
  yield wait(Math.random() * 10 | 0);
  return [].slice.call(arguments);
}
