/**
 * Module Dependencies
 */

var comment = /(?:\/\*[\s\S]+?\*\/|\s*\/\/[^\n]+)/.source;

/**
 * Expose `compile`
 */

module.exports = compile;

/**
 * Compile the regex
 *
 * @param {RegExp} re
 * @return {RegExp}
 */

function compile(re) {
  return new RegExp(comment + '|' + re.source, 'g');
}
