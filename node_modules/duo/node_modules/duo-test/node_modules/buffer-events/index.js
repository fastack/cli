
/**
 * Expose `buffer`
 */

module.exports = buffer;

/**
 * Buffer `emitter`.
 *
 * @param {EventEmitter} emitter
 * @return {Function}
 * @api public
 */

function buffer(emitter){
  var emit = emitter.emit;
  var buf = [];

  emitter.emit = function(){
    buf.push(arguments);
    return this;
  };

  return function(_){
    emitter.emit = emit;
    while (_ = buf.shift()) {
      emit.apply(emitter, _);
    }
  };
}
