'use strict';

var e = require('assert').equal;
var r = require('path').resolve;
var s = require('..');

process.chdir(__dirname);

describe('#pathSearch', function () {
  it('should work with a single directory', function () {
    e(r('a/a'), s(['a'], 'a'));
  });

  it('should take the first found file from path array', function () {
    e(r('b/a'), s(['b', 'a'], 'a'));
  });

  it('should walk up the path until a file is found', function () {
    e(r('b/b'), s(['a', 'b'], 'b'));
  });

  it('should return `undefined` when no file is found', function () {
    e(undefined, s([]));
    e(undefined, s(['a', 'b'], 'c'));
  });
});
