(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep || req);
    }, m, m.exports, outer, modules, cache, entries);

    // store to cache after successful resolve
    cache[id] = m;

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
require('live-reload')
var uid = require('matthewmueller/uid');

// alert(uid());

}, {"live-reload":2,"matthewmueller/uid":3}],
2: [function(require, module, exports) {
(function(){
  // Inject socket.io client script (served by local server)
  var liveReload = document.createElement('script');
  liveReload.setAttribute('src','/socket.io/socket.io.js');
  document.head.appendChild(liveReload);


  liveReload.onload = function() {
    var socket = io(window.location.origin);

    socket.on('reload-page', function() {
      location.reload();
    })

    socket.on('reload-css', function() {
      // https://github.com/dbashford/mimosa-live-reload/blob/master/lib/assets/reload-client.js
      setTimeout(function(){
        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
          var tag = links[i];
          if (tag.rel.toLowerCase().indexOf("stylesheet") >= 0 && tag.href) {
            var newHref = tag.href.replace(/(&|%5C?)\d+/, "");
            tag.href = newHref + (newHref.indexOf("?") >= 0 ? "&" : "?") + (new Date().valueOf());
          }
        }
      }, 150)
    })
  }

})();

}, {}],
3: [function(require, module, exports) {
/**
 * Export `uid`
 */

module.exports = uid;

/**
 * Create a `uid`
 *
 * @param {String} len
 * @return {String} uid
 */

function uid(len) {
  len = len || 7;
  return Math.random().toString(35).substr(2, len);
}

}, {}]}, {}, {"1":""})

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9yZXF1aXJlLmpzIiwiL3NvdXJjZS5qcyIsIi9saXZlLXJlbG9hZCIsIi8uZmFzdGFjay9jb21wb25lbnRzL21hdHRoZXdtdWVsbGVyLXVpZEAwLjAuMi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIvZHVvIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIG91dGVyKG1vZHVsZXMsIGNhY2hlLCBlbnRyaWVzKXtcblxuICAvKipcbiAgICogR2xvYmFsXG4gICAqL1xuXG4gIHZhciBnbG9iYWwgPSAoZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pKCk7XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgYG5hbWVgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGp1bXBlZFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cblxuICBmdW5jdGlvbiByZXF1aXJlKG5hbWUsIGp1bXBlZCl7XG4gICAgaWYgKGNhY2hlW25hbWVdKSByZXR1cm4gY2FjaGVbbmFtZV0uZXhwb3J0cztcbiAgICBpZiAobW9kdWxlc1tuYW1lXSkgcmV0dXJuIGNhbGwobmFtZSwgcmVxdWlyZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZmluZCBtb2R1bGUgXCInICsgbmFtZSArICdcIicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGwgbW9kdWxlIGBpZGAgYW5kIGNhY2hlIGl0LlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gaWRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVxdWlyZVxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICogQGFwaSBwcml2YXRlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGNhbGwoaWQsIHJlcXVpcmUpe1xuICAgIHZhciBtID0geyBleHBvcnRzOiB7fSB9O1xuICAgIHZhciBtb2QgPSBtb2R1bGVzW2lkXTtcbiAgICB2YXIgbmFtZSA9IG1vZFsyXTtcbiAgICB2YXIgZm4gPSBtb2RbMF07XG5cbiAgICBmbi5jYWxsKG0uZXhwb3J0cywgZnVuY3Rpb24ocmVxKXtcbiAgICAgIHZhciBkZXAgPSBtb2R1bGVzW2lkXVsxXVtyZXFdO1xuICAgICAgcmV0dXJuIHJlcXVpcmUoZGVwIHx8IHJlcSk7XG4gICAgfSwgbSwgbS5leHBvcnRzLCBvdXRlciwgbW9kdWxlcywgY2FjaGUsIGVudHJpZXMpO1xuXG4gICAgLy8gc3RvcmUgdG8gY2FjaGUgYWZ0ZXIgc3VjY2Vzc2Z1bCByZXNvbHZlXG4gICAgY2FjaGVbaWRdID0gbTtcblxuICAgIC8vIGV4cG9zZSBhcyBgbmFtZWAuXG4gICAgaWYgKG5hbWUpIGNhY2hlW25hbWVdID0gY2FjaGVbaWRdO1xuXG4gICAgcmV0dXJuIGNhY2hlW2lkXS5leHBvcnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgYWxsIGVudHJpZXMgZXhwb3NpbmcgdGhlbSBvbiBnbG9iYWwgaWYgbmVlZGVkLlxuICAgKi9cblxuICBmb3IgKHZhciBpZCBpbiBlbnRyaWVzKSB7XG4gICAgaWYgKGVudHJpZXNbaWRdKSB7XG4gICAgICBnbG9iYWxbZW50cmllc1tpZF1dID0gcmVxdWlyZShpZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcXVpcmUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEdW8gZmxhZy5cbiAgICovXG5cbiAgcmVxdWlyZS5kdW8gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBFeHBvc2UgY2FjaGUuXG4gICAqL1xuXG4gIHJlcXVpcmUuY2FjaGUgPSBjYWNoZTtcblxuICAvKipcbiAgICogRXhwb3NlIG1vZHVsZXNcbiAgICovXG5cbiAgcmVxdWlyZS5tb2R1bGVzID0gbW9kdWxlcztcblxuICAvKipcbiAgICogUmV0dXJuIG5ld2VzdCByZXF1aXJlLlxuICAgKi9cblxuICAgcmV0dXJuIHJlcXVpcmU7XG59KSIsInJlcXVpcmUoJ2xpdmUtcmVsb2FkJylcbnZhciB1aWQgPSByZXF1aXJlKCdtYXR0aGV3bXVlbGxlci91aWQnKTtcblxuLy8gYWxlcnQodWlkKCkpO1xuIiwiKGZ1bmN0aW9uKCl7XG4gIC8vIEluamVjdCBzb2NrZXQuaW8gY2xpZW50IHNjcmlwdCAoc2VydmVkIGJ5IGxvY2FsIHNlcnZlcilcbiAgdmFyIGxpdmVSZWxvYWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgbGl2ZVJlbG9hZC5zZXRBdHRyaWJ1dGUoJ3NyYycsJy9zb2NrZXQuaW8vc29ja2V0LmlvLmpzJyk7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQobGl2ZVJlbG9hZCk7XG5cblxuICBsaXZlUmVsb2FkLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb2NrZXQgPSBpbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcblxuICAgIHNvY2tldC5vbigncmVsb2FkLXBhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pXG5cbiAgICBzb2NrZXQub24oJ3JlbG9hZC1jc3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9kYmFzaGZvcmQvbWltb3NhLWxpdmUtcmVsb2FkL2Jsb2IvbWFzdGVyL2xpYi9hc3NldHMvcmVsb2FkLWNsaWVudC5qc1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbGlua3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlua3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdGFnID0gbGlua3NbaV07XG4gICAgICAgICAgaWYgKHRhZy5yZWwudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwic3R5bGVzaGVldFwiKSA+PSAwICYmIHRhZy5ocmVmKSB7XG4gICAgICAgICAgICB2YXIgbmV3SHJlZiA9IHRhZy5ocmVmLnJlcGxhY2UoLygmfCU1Qz8pXFxkKy8sIFwiXCIpO1xuICAgICAgICAgICAgdGFnLmhyZWYgPSBuZXdIcmVmICsgKG5ld0hyZWYuaW5kZXhPZihcIj9cIikgPj0gMCA/IFwiJlwiIDogXCI/XCIpICsgKG5ldyBEYXRlKCkudmFsdWVPZigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIDE1MClcbiAgICB9KVxuICB9XG5cbn0pKCk7XG4iLCIvKipcbiAqIEV4cG9ydCBgdWlkYFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gdWlkO1xuXG4vKipcbiAqIENyZWF0ZSBhIGB1aWRgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGxlblxuICogQHJldHVybiB7U3RyaW5nfSB1aWRcbiAqL1xuXG5mdW5jdGlvbiB1aWQobGVuKSB7XG4gIGxlbiA9IGxlbiB8fCA3O1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNSkuc3Vic3RyKDIsIGxlbik7XG59XG4iXX0=