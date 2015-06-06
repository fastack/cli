/**
 * Module dependencies
 */

var debug = require('debug')('duo-watch');
var assert = require('assert');
var sane = require('sane');
var path = require('path');
var basename = path.basename;
var relative = path.relative;
var resolve = path.resolve;
var dirname = path.dirname;
var noop = function(){};
var fs = require('fs');
var join = path.join;

/**
 * Export `watch`
 */

module.exports = watch;

/**
 * Regexps
 */

var rslug = /([A-Za-z0-9-]{1,39})-([A-Za-z0-9-_\.]+)@([A-Za-z0-9-_\/\.$!#%&\(\)\+=]+)/i;

/**
 * Watching cache
 */

var watching = {};

/**
 * Initialize `watch`
 *
 * @param {String} root
 * @return {Watch}
 * @api public
 */

function watch(root) {
  if (watching[root]) return watching[root];
  return watching[root] = new Watch(root);
}

/**
 * Initialize `Watch`
 *
 * @param {String} root
 * @return {Watch}
 * @api private
 */

function Watch(root) {
  if (!(this instanceof Watch)) return new Watch(root);
  assert(root, 'must pass a "root" into watch');

  var self = this;

  this.path = join(root, 'components', 'duo.json');
  this.mapping = json(this.path);
  this.ready = false;
  this.root = root;
  this.fns = [];
  this.idx = {};

  // index entries
  this.index();

  // file watching
  this.sane = sane(root, Object.keys(this.idx))
    .on('change', this.change.bind(this))
    .on('ready', function() { self.ready = true });
}

/**
 * Get an array of dependencies
 *
 * @param {String} entry
 * @param {String} dep (optional)
 * @api private
 */

Watch.prototype.deps = function(entry, dep) {
  var mapping = this.mapping[dep || entry] || {};
  var deps = mapping.deps;
  var idx = this.idx;

  // add self
  if (!dep) idx[entry] = [entry];

  // add each dep
  for (dep in deps) {
    var file = deps[dep];
    if (!idx[file]) idx[file] = [];
    if (!~idx[file].indexOf(entry)) idx[file].push(entry);

    // add the manifest
    this.manifest(entry, file);

    // recurse
    this.deps(entry, file);
  }
};

/**
 * Build or rebuild the index.
 *
 * Watches files & manifests.
 *
 * {
 *   dep: [entry, ...],
 *   ...
 * }
 *
 * @param {String} file (optional)
 * @api private
 */

Watch.prototype.index = function(file) {
  var entries = entry
    ? this.idx[entry]
    : mains(this.mapping);

  for (var i = 0, entry; entry = entries[i++];) {
    entry == file
      ? this.deps(entry)
      : this.deps(entry, file);
  }

  return this;
};

/**
 * React to file changes
 *
 * @param {String} file
 * @api private
 */

Watch.prototype.change = function(file) {
  var entries = this.idx[file] || [];
  var fns = this.fns;
  var idx = this.idx;

  // logging
  debug('detected file change: %s', file);

  // call watch on all entries
  for (var i = 0, entry; entry = entries[i++];) {
    debug('triggering: %s', entry);

    // loop through all the functions
    for (var j = 0, fn; fn = fns[j++];) {
      fn(entry);
    }
  }

  // update mapping
  this.mapping = json(this.path);

  // re-index
  this.index(file);

  // logging
  debug('reindexed: %s. entries: %j', file, idx[file]);

  return this;
};

/**
 * Function to call when an entry
 * or it's deps change.
 *
 * @param {Function} fn
 * @return {Watch}
 * @api public
 */

Watch.prototype.watch = function(fn) {
  this.fns.push(fn || noop);
  return this;
};

/**
 * Stop file watching
 *
 * @return {Watch}
 * @api public
 */

Watch.prototype.close = function() {
  this.sane.close();
  return this;
};

/**
 * Paths to the manifest.
 * May or may not exist.
 *
 * @param {String} entry
 * @param {String} file
 */

Watch.prototype.manifest = function(entry, file) {
  var root = find(this.root, file);
  var manifest = join(root, 'component.json');
  var idx = this.idx;

  if (!idx[manifest]) idx[manifest] = [];
  if (!~idx[manifest].indexOf(entry)) idx[manifest].push(entry);

  return this;
};

/**
 * Read a JSON `path`
 *
 * @param {String} path
 * @return {Object}
 * @api private
 */

function json(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (e) {
    return {};
  }
}

/**
 * Find the root
 *
 * @param {String} root
 * @param {String} path
 * @return {String} root
 */

function find(root, path) {

  while (path != '.' && path != root && !slug(path)) {
    path = dirname(path);
  }

  return path;

  function slug(path) {
    return rslug.test(basename(path));
  }
}

/**
 * Find the mains
 *
 * @param {Object} json
 * @return {Array} out
 * @api private
 */

function mains(json) {
  var out = [];

  for (var dep in json) {
    json[dep].entry && out.push(dep);
  }

  return out;
}
