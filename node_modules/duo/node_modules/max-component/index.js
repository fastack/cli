
/**
 * Module dependencies.
 */

var toFunction = require('to-function');

/**
 * Return the max value in `arr` with optional callback `fn(val, i)`.
 *
 * @param {Array} arr
 * @param {Function} [fn]
 * @return {Number}
 * @api public
 */

module.exports = function(arr, fn){
  var max = 0;

  if (fn) {
    fn = toFunction(fn);
    for (var i = 0; i < arr.length; ++i) {
      var ret = fn(arr[i], i);
      max = ret > max
        ? ret
        : max;
    }
  } else {
    for (var i = 0; i < arr.length; ++i) {
      max = arr[i] > max
        ? arr[i]
        : max;
    }
  }

  return max;
};