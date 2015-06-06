var program = require('commander')
, fs = require('fs-extra')
, Path = require('path')
, Promise = require('bluebird')
, child_process = require('child_process')
, Duo = require('duo')
, duoLess = require('duo-less')
, chokidar = require('chokidar')
, localServer = require('./localServer')
, configure = require('./config.js')
, Logger = require('./logger.js')
, logger = new Logger()
, numeral = require('numeral')
, $ = require('cheerio')
;

// Get the version of the CLI from package.json
var version = require('../package.json').version;

var CWD = process.cwd();

program.version(version)

// process.on('uncaughtException', function(err) {
//     console.log(err);
// });

/*
Command to create a local app
*/
program
.command('init [app_name]')
.description('initialize a fastack app')
.action(function() {
  var fastackDir = CWD + '/.fastack';

})

/*
Command to start development environment: watch and serve files in dev mode
*/
program
.command('dev')
.description('start development enviroment')
.option('-p, --port [port]', 'local port to serve on')
.action(function() {
  var fastackDir = CWD + '/.fastack';
  var config = configure(CWD, logger);

  // logger.start();
  logger.setStartTime(new Date());


  if (!fs.existsSync(fastackDir)) {
    console.log('Current directory is not a fastack application. Run `fastack init` to make it one.')
    return
  }

  var watcher = chokidar.watch(CWD, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
  });

  function compileJS() {

    var duoJS = new Duo(CWD)
    .development(true)
    .sourceMap("inline")
    .copy(true)
    .cache(false)
    .installTo('.fastack/components')
    .buildTo('.fastack/build')
    .include('live-reload', fs.readFileSync(Path.join(CWD, '.fastack/live-reload.js'), 'utf8'))
    .entry("require('live-reload')\n"+ fs.readFileSync(config.main.js, 'utf8'), 'js')


    duoJS.run(function(err, results) {
      if (err) throw err;
      fs.writeFile(Path.join(CWD, '.fastack/fastack.js'), results.code, function(err) {
        if (err) throw err;
        logger.log('Compiled javascript bundle: ' + numeral(Buffer.byteLength(results.code, 'utf8')).format('0.0 b'));
      });

      logger.emit('reload-page')

    })
  }

  function compileCSS() {

    var duoCSS = new Duo(CWD)
    .development(true)
    .sourceMap("inline")
    .copy(true)
    .cache(false)
    .use(duoLess())
    .installTo('.fastack/components')
    .buildTo('.fastack/build')
    .entry(config.main.css)

    duoCSS.run(function(err, results) {
      if (err) throw err;
      fs.writeFile(Path.join(CWD, '.fastack/fastack.css'), results.code, function(err) {
        if (err) throw err;
        logger.log('Compiled stylesheet bundle: ' + numeral(Buffer.byteLength(results.code, 'utf8')).format('0.0 b'));
      });
    });

    logger.emit('reload-css')
  }

  compileJS();
  compileCSS();

  watcher
    .on('all', function(event, path) {

      logger.log('File ' + logger.chalk.yellow(Path.relative(CWD, path)) + ' was written to.');

      switch(Path.extname(path)) {
        case '.js':
          compileJS();
          break;
        case '.css':
          compileCSS();
          break;
        case '.less':
          compileCSS();
          break;
        case '.html':
          logger.emit('reload-page');
          break;
      }
    });

    localServer.start(config, logger);
})



program.parse(process.argv);

if (!program.args.length) {
  program._events.dev();
}
