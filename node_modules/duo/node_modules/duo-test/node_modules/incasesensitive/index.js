
/**
 * Expose `incasesensitive`.
 */

module.exports = incasesensitive;

/**
 * Get the value of `key` from `obj`
 * without worry of casing differences.
 *
 * @param {Object} obj
 * @param {String} key
 * @return {Mixed|Any}
 * @api public
 */

function incasesensitive(obj, key) {
  var key = key.toLowerCase();
  for (var prop in obj) {
    if (!obj.hasOwnProperty(prop)) continue;
    if (prop.toLowerCase() == key) return obj[prop];
  }
}
