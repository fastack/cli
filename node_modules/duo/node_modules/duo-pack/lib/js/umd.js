
/**
 * Expose `umd`
 */

module.exports = (function(){
  return '(' + umd + ')';
})();

/**
 * UMD.
 */

function umd(require){
  if ('object' == typeof exports) {
    module.exports = require(':id');
  } else if ('function' == typeof define && (define.amd || define.cmd)) {
    define(function(){ return require(':id'); });
  } else {
    this[':entry'] = require(':id');
  }
}
