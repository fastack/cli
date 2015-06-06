
/**
 * Module dependencies.
 */

var co = require('co');

/**
 * Command
 */

module.exports = function*(cmd, dt){
  var args = slice(cmd.parent.args);
  var Reporter = dt.Reporter;
  var failures = 0;

  dt.add('phantomjs', { args: args });

  dt.on('browser', function(browser){
    new Reporter(browser.runner);

    browser.runner.once('end', function(obj){
      failures += obj.failures;
    });

    browser.runner.once('fatal', function(obj){
      console.log('\033[31m%s\033[0m', obj.message);
      console.log('  \033[90murl: %s', obj.url);
      console.log('  lineno: %s\033[0m', obj.lineno);
      console.log();
      co(dt.destroy())(function(err){
        process.exit(1);
      });
    });
  });

  yield dt.listen(cmd.parent.port);
  yield dt.run();
  yield dt.destroy();
  process.exit(failures);
};

/**
 * Slice phantom args
 */

function slice(args){
  var i = args.indexOf('args:');
  if (~i) return args.slice(++i);
  return [];
}
