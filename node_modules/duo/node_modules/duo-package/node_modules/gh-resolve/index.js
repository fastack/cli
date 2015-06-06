/**
 * Module dependencies.
 */

var debug = require('debug')('gh-resolve');
var tokenizer = require('mini-tokenizer');
var exec = require('child_process').exec;
var fmt = require('util').format;
var enqueue = require('enqueue');
var semver = require('semver');
var satisfies = semver.satisfies;
var compare = semver.compare;
var valid = semver.valid;
var slice = [].slice;

/**
 * Regexps
 */

var rref = /([A-Fa-f0-9]{40})[\t\s]+refs\/(head|tag)s\/([A-Za-z0-9-_\/\.$!#%&\(\)\+=]+)\n/g;

/**
 * Tokenizer
 */

var tokens = tokenizer(rref, function(m) {
  return { sha: m[1], type: m[2], name: m[3] };
});

/**
 * Expose `resolve`
 */

module.exports = enqueue(resolve, 100);

/**
 * Resolve `slug` with `fn(err, tag)`.
 *
 * @param {String} slug
 * @param {Object} opts (optional)
 * @param {Function} fn
 * @api public
 */

function resolve(slug, opts, fn){
  if (2 == arguments.length) {
    fn = opts
    opts = {};
  }
  var token = opts.token || (
      opts.password && opts.username
        ? [opts.username, opts.password].join(':')
        : ''
    );
  var repo = slug.split('@')[0];
  var ref = slug.split('@')[1];
  var url = remote(repo, token);
  var cmd = fmt('git ls-remote --tags --heads %s', url);

  // options
  opts.retries = undefined == opts.retries ? 1 : opts.retries;

  // max retries reached
  if (!~opts.retries) {
    debug('%s: max retries reached.', slug);
    return fn(error('%s: cannot resolve', slug));
  }

  // execute
  debug('executing: %s', mask(cmd));
  exec(cmd, function(err, stdout, stderr) {
    debug('executed: %s', mask(cmd));
    if (err || stderr) return retry(error(err || stderr));
    var refs = tokens(stdout).sort(arrange);
    var tag = satisfy(refs, ref);
    fn(null, tag);
  });

  // retry
  function retry(err){
    if (~err.message.indexOf('fatal: unable to access')) {
      debug('%s: unable to access, trying %s more time', slug, opts.retries);
      opts.retries--;
      resolve(slug, opts, fn);
    } else {
      fn(err);
    }
  }
}

/**
 * Get the remote url
 *
 * @param {String} token (optional)
 * @return {String}
 * @api private
 */

function remote(name, token) {
  token = token ? token + '@' : '';
  return fmt('https://%sgithub.com/%s', token, name);
}

/**
 * Satisfy `version` with `refs`.
 *
 * @param {Array} refs
 * @param {String} version
 * @return {Object}
 * @api privae
 */

function satisfy(refs, version){
  var master;
  for (var i = 0, ref; ref = refs[i++];) {
    if ('master' == ref.name) master = ref;
    if (equal(ref.name, version)) return ref;
  }
  return master;
}

/**
 * Arrange the refs
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Number}
 * @api public
 */

function arrange(a, b) {
  var ta = a.type == 'tag';
  var tb = b.type == 'tag';

  // place valid tags in front
  if (ta && !tb) return -1;
  if (tb && !ta) return 1;

  var va = !!valid(a.name);
  var vb = !!valid(b.name);

  // place valid semver in front
  // if neither are valid, leave as is
  if (va && !vb) return -1;
  if (!va && !vb) return 0;
  if (vb && !va) return 1;

  // compare the semver
  if (ta && tb) {
    return -compare(a.name, b.name, true);
  }
}

/**
 * Check if the given `ref` is equal to `version`.
 *
 * @param {String} ref
 * @param {String} version
 * @return {Boolean}
 * @api private
 */

function equal(ref, version){
  try {
    return satisfies(ref, version, true) || ref == version;
  } catch (e) {
    return ref == version;
  }
}

/**
 * Create an error
 *
 * @param {String|Error} err
 * @param {Mixed, ...} params
 * @return {Error}
 * @api private
 */

function error(err) {
  err = err.message || err;
  var args = slice.call(arguments, 1);
  var msg = fmt.apply(fmt, [err].concat(args));
  return new Error(mask(msg));
}

/**
 * Mask GitHub token in URL, so it doesn't show up in logs.
 *
 * @param {String} url
 * @return {String}
 * @api private
 */

function mask(url) {
  return url.replace(/\w+@github.com/g, '<token>@github.com');
}
