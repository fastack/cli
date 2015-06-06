/**
 * Module Dependencies
 */

var fs = require('co-fs');

/**
 * Export `exists`
 */

module.exports = exists;

/**
 * Initialize `exists`
 *
 * @param {String|Array} paths
 * @return {Boolean}
 * @api public
 */

function *exists(paths) {
  if (!paths || !paths.length) return false;
  paths = 'string' == typeof paths ? [paths] : paths;
  paths = yield paths.map(stat)
  for (var i = 0; i < paths.length; i++) 
    if (paths[i]) return paths[i]
  return false;
}

/**
 * Stat
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

function *stat(path) {
  try {
    yield fs.stat(path);
    return path;
  } catch (e) {
    return false;
  }
}
