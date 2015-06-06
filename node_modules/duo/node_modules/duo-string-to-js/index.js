/**
 * Module Dependencies
 */

var strtojs = require('string-to-js');

/**
 * Export `string-to-js`
 */

module.exports = plugin;

/**
 * Initialize `plugin`
 *
 * @param {Object} file
 * @param {Object} entry
 */

function plugin() {
  return function stoj(file, entry) {
    if ('js' != entry.type) return;
    if ('js' == file.type) return;

    file.src = 'json' == file.type
      ? 'module.exports = ' + file.src + ';'
      : strtojs(file.src);
    file.type = 'js';
  }
}
