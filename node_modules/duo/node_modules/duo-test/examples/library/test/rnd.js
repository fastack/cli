
var assert = require('component/assert');
var rnd = require('../').rnd;

describe('library.rnd()', function(){
  it('should return a number', function(){
    assert('number' == typeof rnd());
  })
});
