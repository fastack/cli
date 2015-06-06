/**
 * Module Dependencies
 */

var write = require('fs').writeFileSync;
var basename = require('path').basename;
var mkdir = require('mkdirp').sync;
var join = require('path').join;
var Watch = require('..');
var Duo = require('duo');
var root = __dirname;

/**
 * Build Dir
 */

var build = join(root, 'build');

/**
 * Watch
 */

Watch(root).watch(function(file) {
  console.log('changed: %s', file);
  // var out = join(build, basename(file));

  // var duo = Duo(root)
  //  .entry(file)

  // duo.run(function(err, str) {
  //   err && console.error(err);
  //   mkdir(build);
  //   write(out, src);
  //   console.log('rebuilt: %s', file);
  // });
});

console.log('waiting for changes...');
