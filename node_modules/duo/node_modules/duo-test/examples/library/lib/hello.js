
module.exports = hello;

function hello(){
  var args = [].slice.call(arguments);
  return ['hello'].concat(args).join(' ');
}
