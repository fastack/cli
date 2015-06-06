
/**
 * Module dependencies.
 */

var thunkify = require('thunkify');
var open = thunkify(require('open'));

/**
 * Browsers
 */

var browsers = [
  'firefox',
  'chrome',
  'safari',
  'opera',
  'ie',
];

/**
 * Command
 */

module.exports = function*(cmd, dt, args){
  var browser = args[0] || 'chrome';
  var realname = name(browser);
  if (!realname) throw new Error('"' + browser + '" is not supported, supported browsers: ' + browsers);
  yield dt.listen(cmd.parent.port);
  var url = dt.url();
  yield open(url, realname);
};

/**
 * Real browser name
 */

function name(name){
  switch (name) {
    case 'chrome': return 'google chrome';
    case 'ie': return 'internet explorer';
    case 'ff': return 'firefox';
  }
  if (~browsers.indexOf(name)) return name;
}
