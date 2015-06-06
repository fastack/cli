
/**
 * Module dependencies.
 */

var Queue = require('queue-component');
var buffer = require('buffer-events');
var assert = require('assert');
var env = process.env;

/**
 * Command
 */

module.exports = function*(cmd, dt){
  var q = new Queue({ concurrency: 1 });
  var browsers = cmd.browsers;
  var Reporter = dt.Reporter;
  var user = cmd.user;
  var key = cmd.key;
  var failures = 0;

  // validate
  assert(browsers.length, '--browser missing');
  assert(user, '--user must be given');
  assert(key, '--key must be given');

  // start
  dt.auth(user, key);

  // add
  browsers.forEach(function(browser){
    dt.add('saucelabs:' + browser);
  });

  // report
  dt.on('browser', function(browser){
    var runner = browser.runner;
    var flush = buffer(runner);

    function start(){
      console.log();
      console.log('  %s', browser);
    }

    function end(done){
      return function(obj){
        failures += obj.failures;
        done();
      };
    }

    q.push(function(done){
      setImmediate(flush);
      runner.once('end', end(done));
      runner.once('ping', start);
      new Reporter(runner);
    });
  });

  // run
  yield dt.listen(cmd.parent.port);
  yield dt.expose();
  yield dt.run();
  yield dt.destroy();

  // exit
  console.log();
  process.exit(failures);
};
