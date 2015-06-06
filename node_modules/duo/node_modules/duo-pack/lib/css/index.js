/**
 * Module dependencies
 */

var debug = require('debug')('duo-pack:css');
var relative = require('path').relative;
var dirname = require('path').dirname;
var filedeps = require('file-deps');

/**
 * Export `CSS`
 */

module.exports = CSS;

/**
 * Initialize `CSS`
 *
 * @param {Strign} entry
 * @param {Object} mapping
 * @param {Pack} pack
 * @return {CSS}
 * @api public
 */

function CSS(entry, mapping, pack) {
  if (!(this instanceof CSS)) return new CSS(entry, mapping, pack);

  debug('initialized');
  this.mapping = mapping;
  this.entry = entry;
  this.pack = pack;
  this.deps = {};
}

/**
 * Compile the mapping to a string
 *
 * @return {String}
 * @api public
 */

CSS.prototype.run = function() {
  debug('running');
  return {
    code: this.code()
  };
};

/**
 * Generate the CSS source code.
 *
 * @returns {String}
 */

CSS.prototype.code = function () {
  return this.pkg(this.entry).value;
};

/**
 * Package the deps
 *
 * @param {Object} file
 * @param {String} parent (private)
 * @param {Object} tokens (private)
 * @return {String}
 * @api private
 */

CSS.prototype.pkg = function(file, parent, tokens) {
  debug('packaging', file);
  tokens = tokens || {};

  var base = dirname(this.entry.id);
  var mapping = this.mapping;
  var deps = file.deps;
  var src = file.src;

  // pull in all the sources
  // TODO: fix for infinite recursion
  for (var d in deps) {
    tokens[deps[d]] = tokens[deps[d]] || this.pkg(mapping[deps[d]], file, tokens);
  }

  // replace url(...) with relative path
  if (undefined == file.src) {
    var path = relative(base, file.id);
    return this.asset(path);
  }

  // replace @import and url(...)
  src = filedeps(src, 'css', function(d) {
    debug('rewriting import', d);
    var id = deps[d];
    var token = tokens[id] || {};
    var val = token.value;

    // only include source once, but include assets many times
    if ('source' == token.type) tokens[id].value = '';

    return val;
  });

  return this.source(src);
};

/**
 * Create a `asset` token
 *
 * @param {String} value
 * @return {Object}
 * @api private
 */

CSS.prototype.asset = function(value) {
  return { type: 'asset', value: value };
}

/**
 * Create a `source` token
 *
 * @param {String} value
 * @return {Object}
 * @api private
 */

CSS.prototype.source = function(value) {
  return { type: 'source', value: value };
}
