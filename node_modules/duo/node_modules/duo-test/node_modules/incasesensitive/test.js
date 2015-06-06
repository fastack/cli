
var assert = require('assert');
var get = require('./');

var obj = {
  foo: 'foo',
  bAr: 'bar',
  BAZ: 'baz',
  QUx: 'qux',
}

assert('foo' == get(obj, 'foo'));
assert('bar' == get(obj, 'bar'));
assert('bar' == get(obj, 'BAR'));
assert('baz' == get(obj, 'baz'));
assert('qux' == get(obj, 'quX'));
