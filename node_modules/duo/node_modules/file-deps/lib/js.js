
/**
 * Module dependencies
 */

var detective = require('detective');
var escape = require('escape-regexp');

/**
 * Export `js`
 */

module.exports = js;

/**
 * Initialize `js`
 *
 * @param {String} str
 * @param {String} ext
 * @param {Function} fn
 */

function js(str, ext, fn) {
  fn = fn || function() {};

  var deps = detective(str);

  // parse
  if (1 == arguments.length) return deps;

  // rewrite
  deps.map(expr).forEach(function (dep) {
    str = str.replace(dep, function (m, req) {
      if (undefined == req) return m;
      var rep = fn(req, ext);
      if (undefined == rep) return m;
      if (!rep) return '';
      return m.replace(req, rep);
    });
  });
  return str;
}

/**
 * Create a "require"-regex for `dep`.
 *
 * @param {String} dep
 * @return {RegExp}
 * @api private
 */

function expr(dep) {
  return new RegExp('require *\\([\'"](' + escape(dep) + ')[\'"]\\)');
}
