var minimatch = require('minimatch');
var Path = require('path');

function Router(config) {
  this.config = config;
  return this;
}

Router.prototype.notFound = function() {
  return {
    type: 'file',
    path: this.config.errors.notFound
  }
}

Router.prototype.resolve = function(path) {

  var routes = this.config.routes;

  if (Path.extname(path) !== '') { // if request has file extension in it
    return {
      type: 'file',
      path: Path.join(this.config.appDir, path)
    }
  }

  // first see if requested path is defined as a route
  for (var route in routes) {
    var file = routes[route];
    if (minimatch(path, route)) {
      return {
        type: 'file',
        path: Path.join(this.config.appDir, file)
      };
    }
  }

  // redirects
  var redirects = this.config.redirects;

  for (var redirect in redirects) {
    if (minimatch(path, redirect)) {
      return {
        type: 'redirect',
        code: this.config.code || 302,
        path: redirects[redirect]
      };
    }
  }


  // if nothing sticks, return a 404
  return this.notFound();
}


module.exports = Router;
