
/**
 * Module dependencies.
 */

var debug = require('debug')('duo-test:remote');
var Emitter = require('events').EventEmitter;
var wdparse = require('wd-browser');
var timeout = require('co-timeout');
var thunkify = require('thunkify');
var assert = require('assert');
var wd = require('wd');

/**
 * Expose `Remote`
 */

module.exports = Remote;

/**
 * Adapter.
 */

Remote.adapter = function(dt, _, name){
  var names = wdparse(name);
  return names.map(function(conf){
    return Remote({
      name: conf.name,
      version: conf.version,
      platform: conf.platform,
      title: dt.title(),
      auth: dt.auth()
    });
  });
};

/**
 * Regexp.
 */

Remote.adapter.regexp = /^saucelabs:(.+)$/;

/**
 * Initialize `Remote`
 *
 * @param {Object} conf
 * @api public
 */

function Remote(conf){
  if (!(this instanceof Remote)) return new Remote(conf);
  var self = this;
  assert(conf.auth, 'authentication required for saucelabs');
  this.id = Math.random().toString(16).slice(2);
  this.runner = new Emitter;
  this.user = conf.auth.user,
  this.key = conf.auth.key;
  this.title = conf.title;
  this.name = conf.name;
  this.version = conf.version;
  this.platform = conf.platform;
  this.runner.once('ping', function(){
    self.ping = true;
  });
}

/**
 * Connect.
 *
 * @return {Remote}
 * @api public
 */

Remote.prototype.connect = function*(){
  var client = this.client();
  var opts = this.options();
  yield client.init(opts);
  debug('%s: connect', this);
  return this;
};

/**
 * Quit.
 *
 * @return {Remote}
 * @api public
 */

Remote.prototype.quit = function*(){
  yield this.client().quit();
  debug('%s: quit', this);
  return this;
};

/**
 * Get `url`.
 *
 * @param {String} url
 * @return {Remote}
 * @api public
 */

Remote.prototype.get = function*(url){
  var client = this.client();
  var self = this;

  // get url
  debug('%s: get %s', this, url);
  yield client.get(url);

  // wait 2s to `ping` event.
  yield timeout(2e3, function(done){
    if (self.ping) return done();
    self.runner.once('ping', done);
  });

  return this;
};

/**
 * Create wd client with `user`, `key`.
 *
 * @param {String} user
 * @param {String} key
 * @return {Client}
 * @api private
 */

Remote.prototype.client = function(user, key){
  if (this._client) return this._client;
  var client = wd.remote('ondemand.saucelabs.com', 80, this.user, this.key);
  client.quit = thunkify(client.quit);
  client.init = thunkify(client.init);
  client.get = thunkify(client.get);
  return this._client = client;
};

/**
 * Get the configuration.
 *
 * @return {Object}
 * @api private
 */

Remote.prototype.options = function(){
  return {
    platform: this.platform,
    browserName: this.name,
    version: this.version,
    name: this.title,
    tags: []
  };
};

/**
 * Inspect.
 *
 * @return {String}
 * @api public
 */

Remote.prototype.toString = function(){
  return [this.name, this.version, this.platform].join(':');
};
