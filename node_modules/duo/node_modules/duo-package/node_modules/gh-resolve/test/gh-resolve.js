/**
 * Module Dependencies
 */

var env = process.env;
var resolve = require('../');
var assert = require('assert');
var netrc = require('node-netrc');
var auth = netrc('api.github.com') || {};
var tok = env.GITHUB_PASSWORD || auth.password;

/**
 * Tests
 */

describe('resolve()', function(){
  it('should resolve a semver version to gh ref', function(done){
    resolve('component/component@0.19.6', function(err, ref){
      if (err) return done(err);
      assert('6d6501d002aef91f1261f6ec98c6ed32046fe46a' == ref.sha);
      assert('0.19.6' == ref.name);
      assert('tag' == ref.type);
      done();
    });
  });

  it('should sort properly', function(done){
    resolve('component/component@0.19.x', function(err, ref){
      if (err) return done(err);
      assert('0.19.9' == ref.name);
      done();
    });
  });

  it('should resolve a branch to gh ref', function(done){
    resolve('component/component@master', function(err, ref){
      if (err) return done(err);
      assert('master' == ref.name);
      done();
    });
  })

  it('should resolve branches with `/` in them', function(done){
    resolve('cheeriojs/cheerio@refactor/core', function(err, ref){
      if (err) return done(err);
      assert('refactor/core' == ref.name);
      done();
    })
  })

  it('should default to the latest tag when the ref is `*`', function(done){
    resolve('segmentio/analytics.js@*', function(err, ref){
      if (err) return done(err);
      assert(/[\d.]{3}/.test(ref.name));
      done();
    });
  })

  it('should use master when there are no tags and ref is `*`', function(done) {
    resolve('matthewmueller/throttle@*', function(err, ref){
      if (err) return done(err);
      assert('master' == ref.name);
      done();
    });
  })

  it('should use master when there are no tags', function(done){
    resolve('mnmly/slider', function(err, ref){
      if (err) return done(err);
      assert('master' == ref.name);
      done();
    })
  })

  it('should provide better errors for invalid repos', function(done) {
    resolve('sweet/repo@amazing/version', function(err, ref){
      assert(err);
      assert(~err.message.indexOf('Repository not found.'));
      done();
    });
  })

  it('should resolve twbs/bootstrap@* quickly', function(done){
    resolve('twbs/bootstrap@*', function(err, ref){
      if (err) return done(err);
      assert(/[\d.]{3}/.test(ref.name));
      done();
    });
  })

  it('should resolve private repos', function(done) {
    resolve('component/duo@*', { token: tok }, function(err, ref) {
      if (err) return done(err);
      assert(/[\d.]{3}/.test(ref.name));
      done();
    })
  })

  it('should mask token on error', function(done) {
    resolve('sweet/repo@amazing/version', { token: tok }, function(err, ref){
      assert(err);
      assert(!~err.message.indexOf(tok));
      assert(~err.message.indexOf("repository 'https://<token>@github.com/sweet/repo/' not found"));
      done();
    });
  })

  it('should mask password on error', function(done) {
    var opts = { username: 'someuser', password: 'somepassword' };
    resolve('decent/repo@good/version', opts, function(err){
      assert(err);
      assert(!~err.message.indexOf('somepassword'));
      assert(~err.message.indexOf('someuser:<token>@github'));
      done();
    })
  })

  it('should work on weird semvers', function(done){
    resolve('chjj/marked@*', function(err, ref){
      if (err) return done(err);
      assert(/v[.\d]+/.test(ref.name));
      done()
    })
  });

  it('should resolve multiple non-semantic semvers', function(done) {
    resolve('alexei/sprintf.js@*', function(err, ref) {
      if (err) return done(err);
      assert(/[\d.]{3}/.test(ref.name));
      done();
    })
  });
});
