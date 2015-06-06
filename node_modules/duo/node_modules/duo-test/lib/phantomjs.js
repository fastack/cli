
/**
 * Module dependencies.
 */

var debug = require('debug')('duo-test:browser');
var Emitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var timeout = require('co-timeout');
var thunkify = require('thunkify');
var assert = require('assert');
var wd = require('wd');
var which = require('which').sync;

/**
 * Expose `PhantomJS`
 */

module.exports = PhantomJS;

/**
 * Regexp.
 */

PhantomJS.regexp = /^phantom(?:js)?$/;

/**
 * Adapter
 */

PhantomJS.adapter = PhantomJS;

/**
 * Initialize `PhantomJS`.
 *
 * @param {Object} conf
 * @param {Object} opts
 * @api public
 */

function PhantomJS(conf, opts){
  if (!(this instanceof PhantomJS)) return new PhantomJS(conf, opts);
  var self = this;
  this.id = 'phantomjs';
  this.args = opts.args || [];
  this.runner = new Emitter;
  this.bin = conf.bin;
  this.runner.once('ping', function(){
    debug('%s: received ping', self);
    self.ping = true;
  });
}

/**
 * Connect.
 *
 * TODO: `co-proc` module.
 *
 * @return {PhantomJS}
 * @api public
 */

PhantomJS.prototype.connect = function(){
  var self = this;
  return function(done){
    var buf = '';
    var m;
    var phantomPath = findPhantomBinary();

    if (phantomPath === null) {
      throw new Error('Could not find PhantomJS. Please ensure PhantomJS is installed as a devDependency of your project (npm install --save-dev phantomjs), or is available in your $PATH.');
    }

    // spawn
    self.proc = spawn(phantomPath, ['--wd'].concat(self.args));
    self.proc.stdout.on('data', ondata);
    self.proc.on('error', done);

    // onexit
    self.proc.on('exit', function(code){
      if (0 == code) return done();
      done(new Error('phantomjs --wd exited with "' + code + '"'));
    });

    // ondata
    function ondata(c, m){
      if (m = /port (\d+)/g.exec(c + '')) {
        self.proc.stdout.removeListener('data', ondata);
        connect(m[1]);
      }
    }

    // connect
    function connect(port){
      debug('%s: webdriver running on %s', self, port);
      self.client = wd.remote('localhost', port);
      self.client.get = thunkify(self.client.get);
      self.client.init({}, function(err){
        if (err) return done(err);
        debug('%s: connected', self);
        done();
      });
    }
  };
};

/**
 * Quit.
 *
 * @return {PhantomJS}
 * @api public
 */

PhantomJS.prototype.quit = function(){
  var self = this;
  return function(done){
    self.proc.kill();
    done();
  };
};

/**
 * Get `url`.
 *
 * @param {String} url
 * @return {PhantomJS}
 * @api public
 */

PhantomJS.prototype.get = function*(url){
  var client = this.client;
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
 * Inspect.
 *
 * @return {String}
 * @api public
 */

PhantomJS.prototype.toString = function(){
  return 'phantomjs';
};

/**
 * Find a PhantomJS binary by first looking for a local installation (npm
 * package), then looking for a global PhantomJS installation.  If no PhantomJS
 * installation is found, return `null`.
 *
 * @api private
 * @return {string|null}
 */

function findPhantomBinary() {
  var phantomjs = null;

  // Try to find the user's local phantomjs module.
  try {
    phantomjs = require('phantomjs').path;
  } catch(err) {
    // Do nothing
  }

  // Try to find the global phantomjs binary.
  try {
    phantomjs = which('phantomjs');
  } catch(err) {
    // Do nothing
  }

  return phantomjs;
};
