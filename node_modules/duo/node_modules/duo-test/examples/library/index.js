
var Emitter = require('./lib/emitter');

var library = module.exports = new Emitter;

/**
 * Version.
 */

library.version = '1.2.3';

/**
 * Falsey.
 */

library.falsey = require('./lib/falsey');

/**
 * Hello.
 */

library.hello = require('./lib/hello');

/**
 * Random.
 */

library.rnd = require('./lib/rnd');
