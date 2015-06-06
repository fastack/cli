/**
 * Module Dependencies
 */

var co = require('co');
var Pack = require('./');

// file

co(function *() {
  var pack = Pack('build/build.js', { debug: true });
  yield pack({ id: 'a', src: 'module.exports = "hi there"', deps: { 'b': 'b' }});
  yield pack({ id: 'b', src: 'module.exports = "whatever"', deps: {}}, true);
  return 'wrote to build/build.js';
})(done);

// str

co(function *(){
  var pack = Pack({ debug: true });
  var js = yield pack({ id: 'emitter', src: 'module.exports = "emitter"', deps: {} });
  js += yield pack({ id: 'app', src: 'module.exports = require("emitter")', deps: { emitter: 'emitter' }}, true);
  return js;
})(done);

function done(err, js) {
  if (err) throw err;
  console.log();
  console.log('all packed!');
  console.log('-----------');
  console.log(js);
  console.log();
}
