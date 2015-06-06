/**
 * Module Dependencies
 */

var hosts = require('netrc')();

/**
 * Export `netrc`
 */

module.exports = netrc;

/**
 * Initialize `netrc`
 *
 * @param {String} host
 * @return {Object}
 * @api public
 */

function netrc(host) {
  if (!host) return hosts;
  else if (hosts[host]) return hosts[host];
  else return false;
}
