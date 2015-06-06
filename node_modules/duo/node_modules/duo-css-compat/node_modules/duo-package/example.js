/**
 * Module Dependencies
 */

var co = require('co');
var Package = require('./');
var DEBUG = !! process.env.DEBUG;


var a = new Package('component/emitter', '1.0.0')
  .directory('node_modules');

var b = new Package('component/emitter', 'master')
  .directory('node_modules');

var c = new Package('component/emitter', '*')
  .directory('node_modules');


co(function *() {
  yield [a, b, c].map(function(pkg){
    pkg.on('resolving', log(pkg, 'resolving'));
    pkg.on('resolve', log(pkg, 'resolved'));
    pkg.on('fetching', log(pkg, 'fetching'));
    pkg.on('fetch', log(pkg, 'fetched'));
    return pkg.fetch();
  });
})(function(err, pkg) {
  if (err) throw err;
});

function log(pkg, str){
  return function(){
    if (DEBUG) return;
    console.log(str + ' : %s', pkg.slug());
  };
}
