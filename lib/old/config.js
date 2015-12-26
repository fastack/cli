var fs = require('fs');
var Path = require('path');
var _ = require('lodash');

module.exports = function(appDir, logger) {

  var configFile = Path.join(appDir, 'fastack.json');

  // default config options, to be merged with user-defined ones
  var defaultConfig = {
    root: '/',
    routes: {
      '/': 'index.html'
    },
    errors: {
      notFound: Path.join(appDir, '/.fastack/404.html')
    },
    main: {
      js: 'main.js',
      css: 'main.css'
    },
    local: {
      port: 3000
    },
    appDir: appDir
  };

  if (fs.existsSync(configFile)) {
    try {
      var userConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    }
    catch(e) {
      logger.log('Error parsing fastack.json, using default configuration')
      var userConfig = defaultConfig;
    }
  }
  else var userConfig = defaultConfig;

  var config = _.merge({}, defaultConfig, userConfig);


  return config;
}
