
/**
 * Module dependencies.
 */

var Emitter = require('events').EventEmitter;
var debug = require('debug')('duo-test');
var localtunnel = require('localtunnel');
var basename = require('path').basename;
var PhantomJS = require('./phantomjs');
var read = require('fs').readFileSync;
var exists = require('co-fs').exists;
var thunkify = require('thunkify');
var serve = require('koa-static');
var fmt = require('util').format;
var Remote = require('./remote');
var join = require('path').join;
var assert = require('assert');
var exec = require('co-exec');
var _ = require('koa-route');
var http = require('http');
var koa = require('koa');

/**
 * Assets path.
 */

var path = join(__dirname, '..', 'client');

/**
 * Assets
 */

var assets = {
  duotest: read(join(path, 'build.js'), 'utf-8'),
  mochajs: read(require.resolve('mocha/mocha.js'), 'utf-8'),
  mochacss: read(require.resolve('mocha/mocha.css'), 'utf-8'),
  template: require(join(path, 'default.js'))
};

/**
 * Expose `DuoTest`.
 */

module.exports = DuoTest;

/**
 * Initialize `DuoTest`.
 *
 * @param {String} root
 * @param {Object} opts
 * @api public
 */

function DuoTest(root){
  if (!(this instanceof DuoTest)) return new DuoTest(root);
  assert(root, 'root module path must be given');
  Emitter.call(this);
  this.stdout = process.stdout;
  this.stderr = process.stderr;
  this.title(basename(root));
  this.pathname('/test');
  this.build('/build.js');
  this.root = root;
  this.app = koa();
  this.app.use(serve(this.root, { defer: true }));
  this.browsers = {};
  this.adapters = [];
  this.adapter(Remote.adapter.regexp, Remote.adapter);
  this.adapter(PhantomJS.adapter.regexp, PhantomJS);
  this.app.use(_.get('/duotest', this.event()));
  this.app.use(_.get('/duotest.js', this.send()));
}

/**
 * Inherit `Emitter`.
 */

DuoTest.prototype.__proto__ = Emitter.prototype;

/**
 * Add browser adapter with `regexp` and `fn`.
 *
 * @param {RegExp} regexp
 * @param {Function} fn
 * @api public
 */

DuoTest.prototype.adapter = function(regexp, fn){
  this.adapters.push([regexp, fn]);
  return this;
};

/**
 * Set the build path.
 *
 * @param {String} path
 * @return {DuoTest}
 * @api public
 */

DuoTest.prototype.build = function(path){
  if (0 == arguments.length) return this._build;
  if ('/' != path[0]) path = '/' + path;
  this._build = path;
  return this;
};

/**
 * Add a browser `type:name`.
 *
 * Examples:
 *
 *    add('saucelabs:chrome:35..');
 *    add('saucelabs:iphone:stable');
 *    add('saucelabs:chrome:..stable');
 *    add('phantomjs', opts)
 *
 * @param {String} name
 * @param {Object} opts
 * @return {DuoTest}
 * @api public
 */

DuoTest.prototype.add = function(name, opts){
  var all = this.adapters;
  var opts = opts || {};
  var browsers = [];

  for (var i = 0, a; a = all[i++];) {
    var regexp = a[0];
    var fn = a[1];
    var m;

    if (m = regexp.exec(name)) {
      var b = fn(this, opts, m[1]);
      if (!Array.isArray(b)) b = [b];
      browsers.push.apply(browsers, b);
    }
  }

  for (var i = 0; i < browsers.length; ++i) {
    var b = browsers[i];
    this.browsers[b.id] = b;
  }

  return this;
};

/**
 * Set auth `user`, `key`.
 *
 * @param {String} user
 * @param {String} key
 * @return {Object|DuoTest}
 * @api public
 */

DuoTest.prototype.auth = function(user, key){
  if (0 == arguments.length) return this._auth;
  this._auth = { user: user, key: key };
  return this;
};

/**
 * Set your test title.
 *
 * This will be used in the default.html (if used)
 * and will appear in saucelabs UI.
 *
 * @param {String} title
 * @return {String|DuoTest}
 * @api public
 */

DuoTest.prototype.title = function(title){
  if (0 == arguments.length) return this._title;
  this._title = title;
  return this;
};

/**
 * Set your tests path.
 *
 * This will be used in the app, for example
 * if your directory structure is:
 *
 *    - module
 *      - index.js
 *      - tests
 *        - test.js
 *        - index.html
 *
 * The path should be `/tests` since the app
 * is started from ./module and not ./tests
 *
 * @param {String} pathname
 * @return {String}
 * @api public
 */

DuoTest.prototype.pathname = function(pathname){
  if (0 == arguments.length) return this._pathname;
  pathname = normalize(pathname);
  this._pathname = pathname;
  return this;
};

/**
 * Get the url with optional `clientId` to attach.
 *
 * @param {String} id
 * @return {String}
 * @api private
 */

DuoTest.prototype.url = function(id){
  var url = this.tunnel
    ? fmt('%s%s', this.tunnel.url, this.pathname())
    : fmt('http://localhost:%s%s', this.address.port, this.pathname());

  if (1 == arguments.length) {
    url += fmt('%s__id__=%s'
      , ~url.indexOf('?') ? '&' : '?'
      , id);
  }

  return url;
};

/**
 * Expose the app using localtunnel.
 *
 * @return {DuoTest}
 * @api public
 */

DuoTest.prototype.expose = function(){
  var self = this;
  return function(done){
    var port = self.address.port;
    localtunnel(port, function(err, tunnel){
      if (err) return done(err);
      self.tunnel = tunnel;
      debug('localtunnel %s', tunnel.url);
      done(null, self);
    });
  };
};

/**
 * Execute `cmd` as middleware.
 *
 * @param {String} cmd
 * @return {DuoTest}
 * @api private
 */

DuoTest.prototype.command = function(cmd){
  var root = this.root;
  var app = this.app;
  var self = this;

  app.use(function* command(next){
    if (this.path == self.pathname()) {
      debug('exec %s', cmd);
      yield exec(cmd, { cwd: root });
      debug('executed %s', cmd);
    }
    yield next;
  });

  return this;
};

/**
 * Listen on `port`.
 *
 * TODO: serve default html if custom one is not found.
 *
 * @return {DuoTest}
 * @api public
 */

DuoTest.prototype.listen = function*(port){
  var index = join(this.root, this.pathname(), 'index.html');
  var port = port || 0;
  var app = this.app;
  var self = this;

  // when `test-path/index.html`
  // is missing serve the default
  // assets
  if (!(yield exists(index))) {
    debug('index.html not found serving default.html');

    var html = assets.template({
      opts: JSON.stringify({ ui: 'bdd' }),
      title: this.title(),
      build: this.build()
    });

    app.use(_.get(this.pathname(), serve('html', html)));
    app.use(_.get('/mocha.js', serve('js', assets.mochajs)));
    app.use(_.get('/mocha.css', serve('css', assets.mochacss)));
  }

  // serve type, body.
  function serve(type, body){
    return function*(){
      this.type = type;
      this.body = body;
    };
  }

  // server
  var server = http.createServer(this.app.callback());

  // listen
  yield function(done){
    server.listen(port, function(err){
      if (err) return done(err);
      self.server = server;
      self.address = server.address();
      debug('started localhost:%s', self.address.port);
      done();
    });
  };

  return this;
};

/**
 * Destroy.
 *
 * @api public
 */

DuoTest.prototype.destroy = function*(){
  var browsers = this.browsers;
  var keys = Object.keys(browsers);

  // browsers
  yield keys.map(function(k){
    return browsers[k].quit();
  });

  // server
  if (this.server) {
    this.server.close();
  }

  // tunnel
  if (this.tunnel) {
    this.tunnel.close();
  }

  this.address = null;
  this.server = null;
  this.tunnel = null;
  this.app = null;
  debug('destroyed');
  return this;
};

/**
 * Run test on all browsers.
 *
 * @return {DuoTest}
 * @api public
 */

DuoTest.prototype.run = function*(){
  var all = this.browsers;
  var keys = Object.keys(all);
  var self = this;

  debug('test on %d browsers', keys.length);

  yield keys.map(function(k){
    return function*(){
      var browser = all[k];
      var runner = browser.runner;
      var url = self.url(browser.id);

      yield browser.connect();
      self.emit('browser', browser);

      try {
        yield [end, browser.get(url)];
        yield browser.quit();
        delete self.browsers[browser.id];
      } catch (e) {
        yield browser.quit();
        delete self.browsers[browser.id];
        throw e;
      }

      function end(done){
        runner.once('end', function(){
          setImmediate(done);
        });
      }
    };
  });

  debug('tested on %d browsers', keys.length);

  return this;
};

/**
 * Send duotest().
 *
 * @return {Function}
 * @api private
 */

DuoTest.prototype.send = function(){
  var self = this;
  return function*(){
    this.type = 'js';
    this.body = self.adapters.length
      ? assets.duotest
      : 'duotest = function(){};';
    debug('sent duotest()');
  };
};

/**
 * Receive an event from `duotest()`.
 *
 * @return {Function}
 * @api private
 */

DuoTest.prototype.event = function(){
  var self = this;
  return function*(){
    var data = decodeURIComponent(this.query.data);
    var id = this.query.id;
    var b = self.browsers[id];
    var j = JSON.parse(data);

    // edge-case
    if (!b) return;

    // HACK
    if (j.data) {
      j.data.slow = Function('return this._slow');
      j.data.fullTitle = Function('return this._fullTitle');
    }

    // runner
    var runner = b.runner;

    // HACK
    if (!runner.emittedStart) {
      runner.emittedStart = true;
      runner.emit('start');
    }

    // emit
    debug('emit %s %j', j.event, j.data);
    runner.emit(j.event, j.data, j.data.err);

    // callback
    var fn = this.query.callback;
    var js = fmt('(this.%s && this.%s());', fn, fn);
    this.type = 'js';
    this.body = js;
    debug('sent %s', js);
  };
};

/**
 * Normalize `path`.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function normalize(path){
  if ('/' != path[0]) path = '/' + path;
  if ('/' != path.slice(-1)) path += '/';
  return path;
}
