/**
 * Module dependencies
 */

var debug = require('debug')('duo-pack:js:sourcemap');
var sourcemap = require('combine-source-map');
var convert = require('convert-source-map');
var path = require('path');

/**
 * Export `Sourcemap`
 */

module.exports = Sourcemap;

/**
 * Initialize `Sourcemap`
 */

function Sourcemap(entry, inline) {
  if (!(this instanceof Sourcemap)) return new Sourcemap(entry, inline);

  debug('initialized');
  this.sm = sourcemap.create(entry, '/duo');
  this.inline = !!inline;
  this.entry = entry;
  this.lineno = 0;
}

/**
 * Add a file
 *
 * @param {String} file
 * @param {String} src
 * @api public
 */

Sourcemap.prototype.file = function(id, src, wrapped) {
  debug('adding file', id);
  var offset = wrapperOffset(src, wrapped);
  var file = path.resolve('/', id);
  this.sm.addFile({ sourceFile: file, source: src }, { line: this.lineno + offset });
  this.lineno += lineno(wrapped || src);
};

/**
 * Render a source-map comment.
 *
 * @return {String}
 * @api public
 */

Sourcemap.prototype.comment = function() {
  return this.inline
    ? this.sm.comment()
    : '//# sourceMappingURL=' + path.basename(this.entry) + '.map';
};

/**
 * Render an external source-map file.
 *
 * @return {String}
 * @api public
 */

Sourcemap.prototype.external = function () {
  return convert.fromBase64(this.sm.base64()).toJSON()
};

/**
 * Get the number of lines
 *
 * @param {String} src
 * @return {Number}
 * @api private
 */

function lineno(src) {
  if (!src) return 0;
  var m = src.match(/\n/g);
  return m ? m.length + 1: 0;
}

/**
 * Get the number of lines prepended by wrapper
 *
 * @param {String} src
 * @param {String} wrapper
 * @return {Number}
 * @api private
 */

function wrapperOffset(src, wrapped) {
  if (!src || (src && !wrapped)) return 0;
  return wrapped.substr(0, wrapped.indexOf(src)).match(/\n/g).length;
}
