/**
 * Module dependencies
 */

var slice = [].slice;

/**
 * Export `enqueue`
 */

module.exports = enqueue;

/**
 * Initialize `enqueue`
 *
 * @param {Function} fn
 * @param {Number} concurrency
 */

function enqueue(fn, concurrency) {
  concurrency = concurrency || 1;
  var pending = 1;
  var jobs = [];

  return function() {
    var args = slice.call(arguments);
    var last = args[args.length - 1];
    var cb = 'function' == typeof last && last;

    // replace original callback with done
    if (cb) {
      args.pop();
      args.push(done);
    }

    jobs.push([fn, this, args]);
    return next();

    function next() {
      if (pending > concurrency) return;
      var job = jobs.shift();
      if (!job) return;
      pending++;
      return job[0].apply(job[1], job[2]);
    }

    function done(fn) {
      pending--;
      next();
      return cb.apply(this, arguments);
    }
  }
}
