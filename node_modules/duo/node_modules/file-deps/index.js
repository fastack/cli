/**
 * Parsers
 */

var parsers = {};
parsers.js = require('./lib/js');
parsers.css = require('./lib/css');
parsers.html = require('./lib/html');

/**
 * Export `deps`
 */

module.exports = deps;

/**
 * Allow registering custom types
 *
 * @param {String} type
 * @param {Function} fn
 */

exports.register = function (type, fn) {
  parsers[type] = fn;
};

/**
 * Initialize `deps`
 *
 * @param {String} str
 * @param {String} ext
 * @param {Function} fn
 */

function deps(str, ext, fn) {
 return fn
   ? rewrite(str, ext, fn)
   : parse(str, ext);
};

/**
 * Parse
 *
 * @param {String} str
 * @param {String} ext
 * @api public
 */

function parse(str, ext) {
  var parser = parsers[ext];

  return parser
    ? parser(str)
    : [];
}

/**
 * Rewrite
 *
 * @param {String} str
 * @param {String} ext
 * @param {Function} fn
 * @api public
 */

function rewrite(str, ext, fn) {
  var rewriter = parsers[ext];

  return rewriter
    ? rewriter(str, ext, fn)
    : str;
}
