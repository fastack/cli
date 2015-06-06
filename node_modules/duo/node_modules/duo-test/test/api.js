
var request = require('co-request');
var parse = require('url').parse;
var assert = require('assert');
var DuoTest = require('..');
var env = process.env;

describe('API', function(){
  var dt;

  beforeEach(function(){
    dt = DuoTest(__dirname);
    dt.auth(env.SAUCE_USER, env.SAUCE_ACCESS_KEY);
  });

  describe('()', function(){
    it('should throw when root arg is omitted', function(){
      assert.throws(DuoTest);
    });
  });

  describe('(root)', function(){
    it('should be initialized correctly', function(){
      assert(DuoTest('root') instanceof DuoTest);
    });
  });

  describe('.title()', function(){
    it('should default the title to basename', function(){
      assert.equal('test', dt.title());
    });
  });

  describe('.title(title)', function(){
    it('should set the title', function(){
      assert.equal('t', dt.title('t').title());
    });
  });

  describe('.pathname()', function(){
    it('should default the pathname to "/test/"', function(){
      assert.equal('/test/', dt.pathname());
    });
  });

  describe('.pathname(path)', function(){
    it('should set the pathname', function(){
      assert.equal('/t/', dt.pathname('t').pathname());
    });
  });

  describe('.add(phantomjs)', function(){
    it('should add a single phantomjs browser', function(){
      assert.deepEqual({}, dt.browsers);
      dt.add('phantomjs');
      var keys = Object.keys(dt.browsers);
      assert.equal(1, keys.length);
    });
  });

  describe('.add(saucelabs:..)', function(){
    it('should add a single saucelabs remote browser', function(){
      assert.deepEqual({}, dt.browsers);
      dt.add('saucelabs:chrome');
      var keys = Object.keys(dt.browsers);
      assert.equal(1, keys.length);
    });
  });

  describe('.add(saucelabs:chrome:..35', function(){
    it('should add all versions', function(){
      assert.deepEqual({}, dt.browsers);
      dt.add('saucelabs:chrome:..35');
      var keys = Object.keys(dt.browsers);
      assert.equal(10, keys.length);
    });
  });

  describe('.listen(port)', function(){
    it('should start listening on the given port', function*(){
      dt.pathname('fixtures/advanced');
      yield dt.listen(3000);
      var res = yield request(dt.url());
      assert.equal(200, res.statusCode);
      assert.equal('advanced', res.body.match(/<title>([^<]+)<\/title>/)[1]);
      yield dt.destroy();
    });

    it('should serve /duotest.js', function*(){
      dt.pathname('fixtures/advanced');
      yield dt.listen(3000);
      var res = yield request('http://localhost:3000/duotest.js');
      assert.equal(200, res.statusCode);
      yield dt.destroy();
    });
  });

  describe('.expose()', function(){
    it('should expose the server on localtunnel', function*(){
      this.timeout(4e3);
      dt.pathname('fixtures/advanced');
      yield dt.listen(3000);
      yield dt.expose();
      var parsed = parse(dt.url());
      assert.equal('localtunnel', parsed.host.split('.')[1]);
      var res = yield request(dt.url());
      assert.equal(200, res.statusCode);
      assert.equal('advanced', res.body.match(/<title>([^<]+)<\/title>/)[1]);
      yield dt.destroy();
    });
  });

  describe('.add(phantomjs).run()', function(){
    it('should run using phantomjs with custom html', function*(){
      dt.pathname('fixtures/advanced');
      dt.add('phantomjs');
      var runner = pluck(dt.browsers).runner;
      yield dt.listen();
      yield [ensure(runner), dt.run()];
      yield dt.destroy();
    });

    it('should run using phantomjs with default html', function*(){
      dt.pathname('fixtures/simple');
      dt.build('fixtures/simple/build.js');
      dt.add('phantomjs');
      var runner = pluck(dt.browsers).runner;
      yield dt.listen();
      yield [ensure(runner, 1), dt.run()];
      yield dt.destroy();
    });
  });

  describe('.add(saucelabs:safari:stable).run()', function(){
    it('should run using saucelabs with custom html', function*(){
      this.timeout(2e4);
      dt.pathname('fixtures/advanced');
      dt.add('saucelabs:safari:stable');
      var runner = pluck(dt.browsers).runner;
      yield dt.listen();
      yield dt.expose();
      yield [ensure(runner), dt.run()];
      yield dt.destroy();
    });

    it('should run using saucelabs with default html', function*(){
      this.timeout(2e4);
      dt.pathname('fixtures/simple');
      dt.build('fixtures/simple/build.js');
      dt.add('saucelabs:safari:stable');
      var runner = pluck(dt.browsers).runner;
      yield dt.listen();
      yield dt.expose();
      yield [ensure(runner, 1), dt.run()];
      yield dt.destroy();
    });
  });
});

/**
 * Pluck an `obj`.
 */

function pluck(obj){
  var k = Object.keys(obj)[0];
  return obj[k];
}

/**
 * Ensure `end` was emitted with `runner`
 * with the correct number of failures.
 */

function ensure(runner, failures){
  return function(done){
    runner.once('end', function(obj){
      assert.equal(failures || 2, obj.failures);
      done();
    });
  };
}
