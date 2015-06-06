
/**
 * Module dependencies.
 */

var map = require('./map');

/**
 * Expose `parse`
 */

module.exports = parse;

/**
 * Browser aliases.
 */

var names = {
  ie: 'internet explorer',
  ff: 'firefox',
};

/**
 * Regexp.
 */

var regexp = /^(\w+)(:([.\w\*]+))?$/;

/**
 * Parse the given `str`, returning an array of browsers.
 *
 * @param {String} str
 * @return {Array}
 * @api public
 */

function parse(str){
  var m = str.trim().match(regexp) || [];
  var name = names[m[1]] || m[1];
  var version = m[3] || 'stable';
  if (!map[name]) return [];
  return select(name, version);
}

/**
 * Select `version` range of `name`.
 *
 * @param {String} name
 * @param {String} version
 * @return {Array}
 * @api private
 */

function select(name, version){
  var parts = version.split(/[.]{2,3}/);
  var range = /[.]{2,3}/g.test(version);
  var start = parts.shift();
  var end = parts.shift();
  var arr = map[name];
  var first = arr[0].version;
  var last = arr[arr.length - 1].version;

  // normalize
  if (range && !start) start = first;
  if (range && !end) end = last;
  if (!range && !end) end = start;
  if (parseFloat(end) < start) start = end, end = start;
  if ('stable' == start) start = stable(arr);
  if ('stable' == end) end = stable(arr);
  if ('*' == start) start = first;
  if ('*' == end) end = last;

  // indexes
  var i = 0, el;
  while (el = arr[i++]) {
    var f = parseFloat(el.version);
    var v = el.version;
    if (f == start || v == start) start = i - 1;
    if (f == end || v == end) end = i;
    if (v == end) break;
  }

  // slice
  arr = arr.slice(start, end);
  return arr.map(function(el){
    return {
      name: name,
      version: el.version,
      platform: el.platforms[0]
    };
  });
}

/**
 * Get the latest stable version of `arr`.
 *
 * @param {Array} arr
 * @return {Array}
 * @api private
 */

function stable(arr){
  var i = arr.length, el;
  var expr = /beta|alpha|rc|dev/;
  while (el = arr[--i]) {
    if (expr.test(el.version)) continue;
    return el.version;
  }
}
