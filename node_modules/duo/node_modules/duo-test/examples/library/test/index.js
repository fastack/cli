
var assert = require('component/assert');
var semver = require('npm/node-semver:semver.js')
var library = require('../');

describe('library', function(){
  it('should be an emitter', function(done){
    library.once('foo', done).emit('foo')
  })

  it('should expose .version', function(){
    assert(library.version);
  });

  describe('.version', function(){
    it('should be valid to semver', function(){
      assert(library.version == semver.valid(library.version));
    })
  })
})
