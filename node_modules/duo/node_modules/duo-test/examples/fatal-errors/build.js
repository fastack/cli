(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {

describe('Cache', function(){
  var assert = require('component/assert');
  var cache = require('../index');

  throw new Error('error!');

  describe('()', function(){
    it('should return new cache', function(){
      assert(cache() != cache());
    })

    it('should default .max to infinity', function(){
      assert(Infinity == cache()._max);
    })

    it('should default .ttl to 0', function(){
      assert(0 == cache()._ttl);
    })
  })

  describe('({ max: 20 })', function(){
    it('should respect options', function(){
      assert(20 == cache({ max: 20 })._max)
    })
  })

  describe('({ ttl: 2ms })', function(){
    it('should respect options', function(){
      assert(2 == cache({ ttl: '2ms' })._ttl);
    })
  })

  describe('#set', function(){
    it('should push to keys', function(){
      var c = cache();
      c.set('a', 'b');
      c.set('b', 'c');
      assert(2 == c.keys.length);
      assert('b' == c.keys[1]);
    })

    it('should add to `.vals`', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('c', 'c');
      assert('c' == c.vals.c.value);
      assert('a' == c.vals.a.value);
    })

    it('should remove if the key exists', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('a', 'b');
      c.set('c', 'b');
      assert('b' == c.vals.a.value);
      assert(2 == c.keys.length);
      assert('a' == c.keys[0]);
      assert('c' == c.keys[1]);
    })

    it('should cap', function(){
      var c = cache({ max: 2 });
      c.set('a', 'a');
      c.set('b', 'b');
      c.set('c', 'c');
      assert(2 == c.keys.length);
      assert('b' == c.keys[0]);
      assert('c' == c.keys[1]);
    })

    it('should add .created to value', function(){
      assert(cache().set('a', 'b').vals.a.created);
    })

    it('should add .ttl to value', function(){
      assert(0 == cache().set('a', 'b').vals.a.ttl);
    })

    it('should default .ttl to global .ttl', function(){
      var c = cache({ ttl: '1m' });
      c.set('a', 'b');
      var a = c.vals.a;
      assert(6e+4 == a.ttl);
    })

    it('should respect .ttl if given', function(){
      var c = cache({ ttl: '1m' });
      c.set('a', 'b', '2m');
      var a = c.vals.a;
      assert(12e+4 == a.ttl);
    })
  })

  describe('#get', function(){
    it('should return the value', function(){
      assert('a' == cache().set('a', 'a').get('a'));
    })

    it('should promote', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('b', 'b');
      c.set('c', 'c');
      c.set('d', 'd');
      assert('d' == c.keys[c.keys.length - 1]);
      c.get('a');
      assert('a' == c.keys[c.keys.length - 1]);
      c.get('c');
      assert('c' == c.keys[c.keys.length - 1]);
      c.get('b');
      assert('b' == c.keys[c.keys.length - 1]);
      assert('d' == c.keys[0]);
    })
  })

  describe('#has', function(){
    it('should work', function(){
      var c = cache();
      c.set('a', 'a');
      assert(c.has('a'));
      assert(!c.has('b'));
    })
  })

  describe('#remove', function(){
    it('should work', function(){
      var c = cache();
      c.set('a', 'a');
      assert(c.has('a'));
      c.remove('a');
      assert(!c.has('a'));
    })
  })

  describe('#max', function(){
    it('should set ._max', function(){
      assert(2 == cache().max(2)._max);
    })

    it('should cap', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('b', 'b');
      c.set('c', 'c');
      c.max(1);
      assert(1 == c.keys.length);
      assert('c' == c.keys[0]);
      assert('c' == c.vals.c.value);
    })
  })

  describe('#toJSON', function(){
    it('should return object of key => val', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('b', 'b');
      assert('a' == c.toJSON().a);
      assert('b' == c.toJSON().b);
    })
  })

  describe('#promote', function(){
    it('should remove and push a key', function(){
      var c = cache();
      c.set('a', 'a');
      c.set('b', 'b');
      c.set('c', 'c');
      assert(3 == c.keys.length)
      assert('c' == c.keys[c.keys.length - 1]);
      c.promote('a');
      assert(3 == c.keys.length);
      assert('a' == c.keys[c.keys.length - 1]);
    })
  })
})

}, {"component/assert":2,"../index":3}],
2: [function(require, module, exports) {

/**
 * Module dependencies.
 */

var equals = require('equals');
var fmt = require('fmt');
var stack = require('stack');

/**
 * Assert `expr` with optional failure `msg`.
 *
 * @param {Mixed} expr
 * @param {String} [msg]
 * @api public
 */

module.exports = exports = function (expr, msg) {
  if (expr) return;
  throw error(msg || message());
};

/**
 * Assert `actual` is weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.equal = function (actual, expected, msg) {
  if (actual == expected) return;
  throw error(msg || fmt('Expected %o to equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not weak equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notEqual = function (actual, expected, msg) {
  if (actual != expected) return;
  throw error(msg || fmt('Expected %o not to equal %o.', actual, expected));
};

/**
 * Assert `actual` is deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.deepEqual = function (actual, expected, msg) {
  if (equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o to deeply equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not deep equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notDeepEqual = function (actual, expected, msg) {
  if (!equals(actual, expected)) return;
  throw error(msg || fmt('Expected %o not to deeply equal %o.', actual, expected));
};

/**
 * Assert `actual` is strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.strictEqual = function (actual, expected, msg) {
  if (actual === expected) return;
  throw error(msg || fmt('Expected %o to strictly equal %o.', actual, expected), actual, expected);
};

/**
 * Assert `actual` is not strict equal to `expected`.
 *
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @param {String} [msg]
 * @api public
 */

exports.notStrictEqual = function (actual, expected, msg) {
  if (actual !== expected) return;
  throw error(msg || fmt('Expected %o not to strictly equal %o.', actual, expected));
};

/**
 * Assert `block` throws an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.throws = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (!threw) throw error(msg || fmt('Expected %s to throw an error.', block.toString()));
  if (err && !(threw instanceof err)) {
    throw error(msg || fmt('Expected %s to throw an %o.', block.toString(), err));
  }
};

/**
 * Assert `block` doesn't throw an `error`.
 *
 * @param {Function} block
 * @param {Function} [error]
 * @param {String} [msg]
 * @api public
 */

exports.doesNotThrow = function (block, err, msg) {
  var threw;
  try {
    block();
  } catch (e) {
    threw = e;
  }

  if (threw) throw error(msg || fmt('Expected %s not to throw an error.', block.toString()));
  if (err && (threw instanceof err)) {
    throw error(msg || fmt('Expected %s not to throw an %o.', block.toString(), err));
  }
};

/**
 * Create a message from the call stack.
 *
 * @return {String}
 * @api private
 */

function message() {
  if (!Error.captureStackTrace) return 'assertion failed';
  var callsite = stack()[2];
  var fn = callsite.getFunctionName();
  var file = callsite.getFileName();
  var line = callsite.getLineNumber() - 1;
  var col = callsite.getColumnNumber() - 1;
  var src = get(file);
  line = src.split('\n')[line].slice(col);
  var m = line.match(/assert\((.*)\)/);
  return m && m[1].trim();
}

/**
 * Load contents of `script`.
 *
 * @param {String} script
 * @return {String}
 * @api private
 */

function get(script) {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', script, false);
  xhr.send(null);
  return xhr.responseText;
}

/**
 * Error with `msg`, `actual` and `expected`.
 *
 * @param {String} msg
 * @param {Mixed} actual
 * @param {Mixed} expected
 * @return {Error}
 */

function error(msg, actual, expected){
  var err = new Error(msg);
  err.showDiff = 3 == arguments.length;
  err.actual = actual;
  err.expected = expected;
  return err;
}

}, {"equals":4,"fmt":5,"stack":6}],
4: [function(require, module, exports) {

var type = require('type')

// (any, any, [array]) -> boolean
function equals(a, b, memos){
  // All identical values are equivalent
  if (a === b) return true
  var fnA = types[type(a)]
  var fnB = types[type(b)]
  return fnA && fnA === fnB
    ? fnA(a, b, memos)
    : false
}

var types = {}

// (Number) -> boolean
types.number = function(a){
  // NaN check
  return a !== a
}

// (function, function, array) -> boolean
types['function'] = function(a, b, memos){
  return a.toString() === b.toString()
    // Functions can act as objects
    && types.object(a, b, memos)
    && equals(a.prototype, b.prototype)
}

// (date, date) -> boolean
types.date = function(a, b){
  return +a === +b
}

// (regexp, regexp) -> boolean
types.regexp = function(a, b){
  return a.toString() === b.toString()
}

// (DOMElement, DOMElement) -> boolean
types.element = function(a, b){
  return a.outerHTML === b.outerHTML
}

// (textnode, textnode) -> boolean
types.textnode = function(a, b){
  return a.textContent === b.textContent
}

// decorate `fn` to prevent it re-checking objects
// (function) -> function
function memoGaurd(fn){
  return function(a, b, memos){
    if (!memos) return fn(a, b, [])
    var i = memos.length, memo
    while (memo = memos[--i]) {
      if (memo[0] === a && memo[1] === b) return true
    }
    return fn(a, b, memos)
  }
}

types['arguments'] =
types.array = memoGaurd(compareArrays)

// (array, array, array) -> boolean
function compareArrays(a, b, memos){
  var i = a.length
  if (i !== b.length) return false
  memos.push([a, b])
  while (i--) {
    if (!equals(a[i], b[i], memos)) return false
  }
  return true
}

types.object = memoGaurd(compareObjects)

// (object, object, array) -> boolean
function compareObjects(a, b, memos) {
  var ka = getEnumerableProperties(a)
  var kb = getEnumerableProperties(b)
  var i = ka.length

  // same number of properties
  if (i !== kb.length) return false

  // although not necessarily the same order
  ka.sort()
  kb.sort()

  // cheap key test
  while (i--) if (ka[i] !== kb[i]) return false

  // remember
  memos.push([a, b])

  // iterate again this time doing a thorough check
  i = ka.length
  while (i--) {
    var key = ka[i]
    if (!equals(a[key], b[key], memos)) return false
  }

  return true
}

// (object) -> array
function getEnumerableProperties (object) {
  var result = []
  for (var k in object) if (k !== 'constructor') {
    result.push(k)
  }
  return result
}

/**
 * assert all values are equal
 *
 * @param {Any} [...]
 * @return {Boolean}
 */

function allEqual(){
  var i = arguments.length - 1
  while (i > 0) {
    if (!equals(arguments[i], arguments[--i])) return false
  }
  return true
}

/**
 * expose equals
 */

module.exports = allEqual
allEqual.compare = equals

}, {"type":7}],
7: [function(require, module, exports) {

var toString = {}.toString
var DomNode = typeof window != 'undefined'
  ? window.Node
  : Function

/**
 * Return the type of `val`.
 *
 * @param {Mixed} val
 * @return {String}
 * @api public
 */

module.exports = exports = function(x){
  var type = typeof x
  if (type != 'object') return type
  type = types[toString.call(x)]
  if (type) return type
  if (x instanceof DomNode) switch (x.nodeType) {
    case 1:  return 'element'
    case 3:  return 'text-node'
    case 9:  return 'document'
    case 11: return 'document-fragment'
    default: return 'dom-node'
  }
}

var types = exports.types = {
  '[object Function]': 'function',
  '[object Date]': 'date',
  '[object RegExp]': 'regexp',
  '[object Arguments]': 'arguments',
  '[object Array]': 'array',
  '[object String]': 'string',
  '[object Null]': 'null',
  '[object Undefined]': 'undefined',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Object]': 'object',
  '[object Text]': 'text-node',
  '[object Uint8Array]': 'bit-array',
  '[object Uint16Array]': 'bit-array',
  '[object Uint32Array]': 'bit-array',
  '[object Uint8ClampedArray]': 'bit-array',
  '[object Error]': 'error',
  '[object FormData]': 'form-data',
  '[object File]': 'file',
  '[object Blob]': 'blob'
}

}, {}],
5: [function(require, module, exports) {

/**
 * Export `fmt`
 */

module.exports = fmt;

/**
 * Formatters
 */

fmt.o = JSON.stringify;
fmt.s = String;
fmt.d = parseInt;

/**
 * Format the given `str`.
 *
 * @param {String} str
 * @param {...} args
 * @return {String}
 * @api public
 */

function fmt(str){
  var args = [].slice.call(arguments, 1);
  var j = 0;

  return str.replace(/%([a-z])/gi, function(_, f){
    return fmt[f]
      ? fmt[f](args[j++])
      : _ + f;
  });
}

}, {}],
6: [function(require, module, exports) {

/**
 * Expose `stack()`.
 */

module.exports = stack;

/**
 * Return the stack.
 *
 * @return {Array}
 * @api public
 */

function stack() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}
}, {}],
3: [function(require, module, exports) {

/**
 * dependencies
 */

var ms = require('guille/ms.js');

/**
 * Export `Cache`
 */

module.exports = Cache;

/**
 * Has.
 */

var has = ({}).hasOwnProperty;

/**
 * Initialize `Cache`.
 *
 * @param {Object} opts
 * @api public
 */

function Cache(opts){
  if (!(this instanceof Cache)) return new Cache(opts);
  opts = opts || {};
  opts.max = opts.max || Infinity;
  opts.ttl = opts.ttl || 0;
  this.keys = [];
  this.vals = {};
  this.max(opts.max);
  this.ttl(opts.ttl);
}

/**
 * Set `ttl`.
 *
 * @param {Number|String} ttl
 * @return {Cache}
 * @api public
 */

Cache.prototype.ttl = function(ttl){
  this._ttl = 'string' == typeof ttl
    ? ms(ttl)
    : ttl;

  return this;
};

/**
 * Set `key`, `val` and optional `ttl`
 *
 * @param {String|Object} key
 * @param {Mixed} val
 * @param {String|Number} ttl
 * @return {Cache}
 * @api public
 */

Cache.prototype.set = function(key, val, ttl){
  if ('object' == typeof key) {
    for (var k in key) this.set(k, key[k], ttl);
    return this;
  }

  // remove
  if (this.has(key)) {
    this.remove(key);
  }

  // ttl
  if ('string' == typeof ttl) ttl = ms(ttl);

  // add
  this.keys.push(key);
  this.vals[key] = {
    ttl: ttl || this._ttl,
    created: +new Date,
    value: val
  };

  // cap
  this.cap();
  return this;
};

/**
 * Get `key`.
 *
 * @param {String} key
 * @return {Mixed}
 * @api public
 */

Cache.prototype.get = function(key){
  if (!this.has(key)) return;
  var val = this.vals[key];

  // ttl
  if (val.ttl && new Date > val.ttl + val.created) {
    this.remove(key);
    return;
  }

  // promote
  this.promote(key);

  // value
  return val.value;
};

/**
 * Has `key`
 *
 * @param {String} key
 * @return {Boolean}
 * @api public
 */

Cache.prototype.has = function(key){
  return has.call(this.vals, key);
};

/**
 * Remove `key`
 *
 * @param {String} key
 * @return {Cache}
 * @api public
 */

Cache.prototype.remove = function(key){
  if (!this.has(key)) return this;
  var i = this.keys.indexOf(key);
  this.keys.splice(i, 1);
  delete this.vals[key];
  return this;
};

/**
 * Set `max`.
 *
 * @param {Number} max
 * @return {Cache}
 * @api public
 */

Cache.prototype.max = function(max){
  this._max = max;
  this.cap();
  return this;
};

/**
 * To json
 *
 * @return {Object}
 * @api public
 */

Cache.prototype.toJSON = function(){
  var ret = {};

  for (var k in this.vals) {
    if (!has.call(this.vals, k)) continue;
    ret[k] = this.vals[k].value;
  }

  return ret;
};

/**
 * Promote `key`
 *
 * @param {String} key
 * @return {Cache}
 * @api public
 */

Cache.prototype.promote = function(key){
  if (!this.has(key)) return this;
  var i = this.keys.indexOf(key);
  this.keys.splice(i, 1);
  this.keys.push(key);
  return this;
};

/**
 * Cap
 *
 * @return {Cache}
 * @api private
 */

Cache.prototype.cap = function(){
  var length = this.keys.length
    , n = length - this._max;

  while (0 < n--) {
    var k = this.keys.shift();
    delete this.vals[k];
  }

  return this;
};

}, {"guille/ms.js":8}],
8: [function(require, module, exports) {
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

}, {}]}, {}, {"1":""})
