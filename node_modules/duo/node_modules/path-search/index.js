'use strict';

var nodePath = require('path');
var fs = require('fs');

/**
 * @param {Array} path
 * @param {String} name
 */
module.exports = function pathSearch(path, name) {
  for (var i = 0; i < path.length; i++) {
    var candidate = nodePath.resolve(path[i], name);

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
};
