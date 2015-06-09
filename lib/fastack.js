var program = require('commander')
, fs = require('fs-extra')
, Path = require('path')
, Promise = require('bluebird')
, numeral = require('numeral')

, Duo = require('duo')
, duoLess = require('duo-less')
, duoCoffee = require('duo-coffee-script')
, duoJade = require('duo-jade')
, duoAutoPrefixer = require('duo-autoprefixer')
, duo6to5 = require('duo-6to5')
, duoStylus = require('duo-stylus')

, chokidar = require('chokidar')
, localServer = require('./localServer')
, configure = require('./config.js')
, Logger = require('./logger.js')
, logger = new Logger()
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
  var fastackDir = Path.join(CWD, '/.fastack');
  var dotFastack = Path.join(__dirname, '../test-app/.fastack');

  if (fs.existsSync(fastackDir)) {
    console.log('Current directory is already a Fastack app!')
    return
  }

  fs.copy(dotFastack, fastackDir, {
    filter: function(srcPath) {
      return !(srcPath.indexOf('components') > -1)
    }
  }, function(err) {
    if (err) return console.error(err);
    console.log('Fastack app initialized in current directory: ' + CWD);
  });

})

/*
Command to start development environment: watch and serve files in dev mode
*/
program
.command('dev')
.description('start development enviroment')
.option('-p, --port [port]', 'local port to serve on')
.action(function() {
  var fastackDir = Path.join(CWD, '/.fastack');
  var config = configure(CWD, logger);


  if (!fs.existsSync(fastackDir)) {
    console.log('Current directory is not a fastack application. Run `fastack init` to make it one.')
    return
  }

  if (!fs.existsSync(config.main.js)) {

  }

  logger.start();
  logger.setStartTime(new Date());

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
    .use(duoCoffee())
    .use(duoJade())
    // .use(duo6to5({sourceFileName: config.main.js}))
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
    .sourceMap(true)
    .copy(true)
    .cache(false)
    .use(duoLess())
    .use(duoStylus())
    // .use(duoAutoPrefixer())
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
        case '.styl':
          compileCSS();
          break;
        case '.coffee':
          compileJS();
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
