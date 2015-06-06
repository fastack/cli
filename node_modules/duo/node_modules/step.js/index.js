/**
 * Module Dependencies
 */

var slice = Array.prototype.slice;
var noop = function() {};
var co = require('co');

/**
 * Export `Step`
 */

module.exports = Step;

/**
 * Initialize `Step`
 *
 * @param {Mixed} fn (optional)
 * @return {Step}
 * @api public
 */

function Step(fn) {
  if (!(this instanceof Step)) return new Step(fn);
  this.fns = [];
  this.length = 0;
  fn && this.use(fn);
}

/**
 * Add a step
 *
 * @param {Function|Generator|Array} fn
 * @return {Step}
 * @api public
 */

Step.prototype.use = function(fn) {
  if (fn instanceof Step) this.fns = this.fns.concat(fn.fns);
  else if (fn instanceof Array) this.fns = this.fns.concat(fn);
  else this.fns.push(fn);
  this.length = this.fns.length;
  return this;
};

/**
 * Run the steps
 *
 * @param {Args...} args
 * @param {Function} fn
 * @api public
 */

Step.prototype.run = function() {
  var args = slice.call(arguments);
  var fns = slice.call(this.fns);
  var len = args.length;
  var ctx = this;

  // callback or noop
  var done = 'function' == typeof args[len - 1]
    ? args.pop()
    : noop;

  // kick us off
  // next tick to ensure we're async (no double callbacks)
  setTimeout(function() {
    call(fns.shift(), args);
  }, 0);

  // next
  function next(err) {
    if (err) return done(err);
    var arr = slice.call(arguments, 1);
    args = extend(args, arr);
    var fn = fns.shift();
    call(fn, args);
  }

  // call
  function call(fn, args) {
    if (!fn) {
      return done.apply(done, [null].concat(args));
    } else if (fn.length > args.length) {
      fn.apply(ctx, args.concat(next));
    } else if (generator(fn)) {
      co(fn).apply(ctx, args.concat(next));
    } else {
      var ret = fn.apply(ctx, args);
      ret instanceof Error ? next(ret) : next(null, ret);
    }
  }
};

/**
 * Pull values from another array
 * @param  {Array} a
 * @param  {Array} b
 * @return {Array}
 */

function extend(a, b) {
  var len = a.length;
  var out = [];

  for (var i = 0; i < len; i++) {
    out[i] = undefined === b[i] ? a[i] : b[i];
  }

  return out;
}

/**
 * Is generator?
 *
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function generator(value){
  return value
    && value.constructor
    && 'GeneratorFunction' == value.constructor.name;
}
