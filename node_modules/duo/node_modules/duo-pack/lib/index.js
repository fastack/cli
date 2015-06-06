
/**
 * Module dependencies.
 */

var debug = require('debug')('duo-pack');

/**
 * Expose `Pack`
 */

module.exports = Pack;

/**
 * Default Packs
 */

var js = Pack.js = require('./js');
var css = Pack.css = require('./css');

/**
 * Initialize `Pack`
 *
 * @param {Object} mapping
 * @param {Object} opts
 * @return {Pack}
 * @api public
 */

function Pack(mapping, opts) {
  if (!(this instanceof Pack)) return new Pack(mapping, opts);

  debug('initialized');
  this.opts = opts || {};
  this.mapping = mapping;
  this.sourceMap(false);
}

/**
 * Development
 *
 * @param {Boolean} develop
 * @return {Pack}
 * @api public
 */

Pack.prototype.sourceMap = function(value) {
  if (typeof value === 'undefined') return this.sm;
  debug('setting source-map', value);
  this.sm = value;
  return this;
};

/**
 * Pack the assets
 *
 * @param {String} entry
 * @return {Pack}
 * @api public
 */

Pack.prototype.pack = function(entry) {
  debug('packing', entry);
  var mapping = this.mapping;
  var dep = mapping[entry];
  var type = dep.type;

  // ensure we have a fn for type
  if (!Pack[type]) return false;

  // pack the source
  return Pack[type](dep, mapping, this).run();
};
