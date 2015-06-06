
var max = require('..');

var tobi = { name: { first: 'tobi' }, age: 2, role: { name: 'admin' } };
var loki = { name: { first: 'loki' }, age: 1 };
var jane = { name: { first: 'jane' }, age: 8 };

describe('max(arr, fn)', function(){
  it('should return the max value', function(){
    var arr = [1,2,3];
    arr = max(arr, function(n){ return n * 2 });
    arr.should.eql(6);
  })

  it('should support property strings', function(){
    var users = [tobi, loki, jane];
    var arr = max(users, 'age');
    arr.should.eql(8);
  })
})

describe('max(arr)', function(){
  it('should return the max value', function(){
    max([1,5,2]).should.equal(5);
  })
})