
var assert = require('component/assert');
var falsey = require('../').falsey;

describe('library.falsey()', function(){
  it('should return false', function(){
    assert(false == falsey());
  })
})
