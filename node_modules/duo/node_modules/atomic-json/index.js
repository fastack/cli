/**
 * Module dependencies
 */

var write = require('fs').writeFile;
var read = require('fs').readFile;
var extend = require('extend.js');
var enqueue = require('enqueue');

/**
 * Export `atomic`
 */

module.exports = function(path) {
  if (atomics[path]) return atomics[path];
  return atomics[path] = atomic(path);
};

/**
 * path cache
 */

var atomics = {};

/**
 * json cache
 */

var jsons = {};

/**
 * Initialize `atomic`
 */

function atomic(path) {
  return enqueue(function(obj, fn) {
    json(path, function(map) {
      map = extend(map, obj);
      write(path, stringify(map), function(err) {
        if (err) fn(err);
        else fn(null, map);
      });
    });
  });
}

/**
 * Load the `json`
 *
 * @param {String} path
 * @return {Object}
 * @api private
 */

function json(path, fn) {
  if (jsons[path]) return fn(jsons[path]);

  read(path, function(err, str) {
    if (err) return fn(jsons[path] = {});
    try { return fn(jsons[path] = JSON.parse(str)); }
    catch (e) { return fn(jsons[path] = {}); }
  });
}

/**
 * Stringify
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function stringify(obj) {
  return JSON.stringify(obj, true, 2);
}
