
describe('advanced', function(){
  it('should succeed', function(){});

  it('should skip');

  it('should timeout', function(done){
    setTimeout(done, 21);
  });

  it('should error', function(){
    var err = new Error('err');
    err.expected = 1;
    err.actual = 2;
    err.showDiff = true;
    throw err;
  });
});
