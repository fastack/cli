
describe('add', function(){
  var assert = require('component/assert');
  var add = require('../index');

  it('should skip');

  it('should add some numbers', function(){
    assert.equal(2, add(1, 1));
  });

  it('should timeout', function(done){
    setTimeout(done, 101);
  });

  it('should error', function(){
    throw new Error('boom');
  });
})
