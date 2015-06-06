/**
 * Module Dependencies
 */

var reqpath = require.resolve('./require');
var debug = require('debug')('duo-pack:js');
var sourcemap = require('./sourcemap');
var fmt = require('util').format;
var req = require('./require');
var stringify = JSON.stringify;
var umd = require('./umd');
var ids = {};
var uid = 0;

/**
 * Expose `JS`
 */

module.exports = JS;

/**
 * Initialize `JS`
 *
 * @param {String} entry
 * @param {Object} mapping
 * @param {Pack} pack
 * @return {Function}
 * @api public
 */

function JS(entry, mapping, pack) {
  if (!(this instanceof JS)) return new JS(entry, mapping, pack);

  debug('initialized');
  this.sm = this.sourceMap(entry.id, pack.sourceMap());
  this.mapping = mapping;
  this.opts = pack.opts;
  this.entry = entry;
  this.pack = pack;
  this.ids = {};
  this.uid = 0;
}

/**
 * Sets up the source-map.
 *
 * @param {String} entry          the entry file id
 * @param {Boolean|String} value  true/false/'inline'
 */

JS.prototype.sourceMap = function (entry, state) {
  if (!state) return false;
  return sourcemap(entry, state === 'inline');
}

/**
 * Packs the entry/mapping into a single result object.
 *
 * @returns {Object}
 * @api public
 */

JS.prototype.run = function () {
  debug('running');
  return {
    code: this.code(),
    map: this.map()
  };
};

/**
 * Compile the mapping to a string
 *
 * @return {String}
 */

JS.prototype.code = function() {
  var str = '%s({\n%s}, {}, %s)';
  var entry = this.entry;

  // add require to source-map
  if (this.sm) this.sm.file('require.js', req);

  // build the source
  var src = this.pkg(entry);

  // global support
  var id = this.remap(entry).id;
  var m = {};
  m[id] = entry.global || '';

  // umd support
  if (this.opts.umd && entry.name) {
    str = fmt('%s(%s);', umd
      .replace(/:entry/g, entry.name)
      .replace(/:id/g, id)
      , str);
  }

  if (this.sm) str += '\n\n' + this.sm.comment();

  return fmt(str, req, join(src), stringify(m));
};

/**
 * Returns the generated source-map.
 *
 * @reutrns {Object}
 */

JS.prototype.map = function () {
  if (!this.sm) return false;
  if (this.sm.inline) return false;
  return this.sm.external();
}

/**
 * Package the deps
 *
 * @param {Object} dep
 * @param {Object} out (private)
 * @return {String}
 * @api private
 */

JS.prototype.pkg = function(dep, out) {
  debug('packaging', dep.id);
  out = out || {};

  if (out[dep.id]) return out;

  var id = dep.id;
  var src = dep.src;
  var deps = dep.deps;
  var remapped = this.remap(dep);
  var str = fmt('%d: [%s, %s]', remapped.id, wrap(src), stringify(remapped.deps));

  // add to out
  out[id] = str;

  // add file to sourcemap
  if (this.sm) this.sm.file(id, src, str);

  // recurse through dep's deps
  for (var d in deps) {
    this.pkg(this.mapping[deps[d]], out);
  }

  return out;
}

/**
 * Remap JSON file paths to uids
 *
 * @param {Object} dep
 * @return {Object}
 * @api private
 */

JS.prototype.remap = function(dep) {
  debug('remapping', dep.id);
  var out = {};

  out.id = this.id(dep.id);
  out.deps = {};

  for (var req in dep.deps) {
    out.deps[req] = this.id(dep.deps[req]);
  }

  return out;
}

/**
 * Get or set the uid
 *
 * @param {String} file
 * @return {Number}
 * @api private
 */

JS.prototype.id = function(file) {
  return this.ids[file] = this.ids[file] || ++this.uid;
}

/**
 * Wrap the source in a function
 *
 * @param {String} src
 * @return {String}
 * @api private
 */

function wrap(src) {
  return fmt('function(require, module, exports) {\n%s\n}', src);
}

/**
 * Join the sources
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function join(obj) {
  var out = [];
  for (var id in obj) out.push(obj[id]);
  return out.join(',\n');
}
