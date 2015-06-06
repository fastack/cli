
var tests = require('./tests');
var assert = require('assert');
var parse = require('..');

describe('parse', function(){
  var names = Object.keys(tests);
  names.forEach(function(name){
    var out = tests[name];
    it(name, function(){
      try {
        assert.deepEqual(parse(name), out);
      } catch (e) {
        e.showDiff = true;
        throw e;
      }
    })
  })
})
