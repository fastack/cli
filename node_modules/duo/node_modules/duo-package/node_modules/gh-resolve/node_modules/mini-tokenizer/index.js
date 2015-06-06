/**
 * Module Dependencies
 */

var rrep = /(\$(`|&|'|\d+))/g;
var slice = [].slice;
var noop = function(m) { return m[0]; }

/**
 * Expose `tokens`
 */

module.exports = tokens;

/**
 * Create a tokenizer
 *
 * @param {Regex} regex
 * @param {String|Function} rep
 * @return {Function}
 */

function tokens(regex, rep) {
  rep = rep || noop;
  rep = 'function' == typeof rep ? rep : compile(rep);

  return function(str) {
    var toks = [];

    str.replace(regex, function() {
      var args = slice.call(arguments);
      var tok = rep(args);
      tok && toks.push(tok);
    });

    return toks;
  };
}

/**
 * Compile the replacer
 *
 * @param {String} str
 * @return {String}
 */

function compile(str) {
  var expr = str.replace(rrep, function(m) {
    var out = '\' + ($[';
    out += '&' == m[1] ? 0 : m[1];
    out += '] || \'\') + \'';
    return out;
  })

  expr = '\'' + expr + '\'';
  return new Function('$', 'return ' + expr);
}
