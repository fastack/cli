/**
 * Module Dependencies
 */

var type = require('component-type');
var path = require('path');
var extname = path.extname;

/**
 * Regexps
 */

var rsupport = /^(js|css)$/;

/**
 * Export `coerce`
 */

module.exports = coerce;

/**
 * Coerce the "main"'s from a manifest's JSON
 *
 * @param {Object} json
 * @return {Array}
 * @api private
 */

function coerce(json, type) {
  return type
    ? dependency(json, type)
    : entry(json);
};

/**
 * Get the mains from an entry
 *
 * @param {Object} json
 * @return {Array}
 * @api private
 */

function entry(json) {
  var script = (json.scripts || [])[0];
  var style = (json.styles || [])[0];
  var main = json.main;
  var entries = [];

  switch(type(main)) {
    case 'object': entries = entries.concat(values(main)); break;
    case 'array': entries = entries.concat(main); break;
    case 'string': entries.push(main); break;
  }

  if (!main || compat(json)) {
    switch (extension(main)) {
      case 'css': script && entries.push(script); break;
      case 'js': style && entries.push(style); break;
      case '':
        script && entries.push(script);
        style && entries.push(style);
        break;
    }
  }

  return entries;
}

/**
 * Get the main from a dependency
 *
 * @param {Object} json
 * @param {String} ext
 * @return {String|Boolean}
 */

function dependency(json, ext) {
  var script = (json.scripts || [])[0];
  var style = (json.styles || [])[0];
  var main = json.main;

  if (!main || compat(json)) {
    if (ext == extension(json.main)) return main;
    else if (ext == extension(style)) return style;
    else if (ext == extension(script)) return script;
    else return false;
  }

  switch(type(main)) {
    case 'object': return main[ext] || false;
    case 'string': return main;
  }

  return false;
}

/**
 * Compatibility
 *
 * @param {Object} json
 * @return {Boolean}
 */

function compat(json) {
  var main = json.main;
  var ext = extension(main);

  return rsupport.test(ext)
    && 'string' == type(json.main);
}

/**
 * Get the values of an object
 *
 * @param {Object} obj
 * @return {Array}
 * @api private
 */

function values(obj) {
  return Object.keys(obj).map(function(k) {
    return obj[k];
  });
}

/**
 * Get the extension
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function extension(path) {
  return extname(path).slice(1);
}
