describe('to-pascal-case', function () {

var assert = require('assert');
var pascal = require('to-pascal-case');

var strings = {
  camel    : 'thisIsAString',
  constant : 'THIS_IS_A_STRING',
  dot      : 'this.is.a.string',
  pascal   : 'ThisIsAString',
  sentence : 'This is a string.',
  snake    : 'this_is_a_string',
  space    : 'this is a string',
  title    : 'This Is a String'
};

function convert (key) {
  it('should convert ' + key + ' case', function () {
    assert('ThisIsAString' == pascal(strings[key]));
  });
}

for (var key in strings) convert(key);

});