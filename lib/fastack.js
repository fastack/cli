const vorpal = require('vorpal')()
	, vorpalLog = require('vorpal-log')
	, chalk = require('chalk')
	, Syncano = require('syncano')
	, Path = require('path')
;

var FASTACK = {};

vorpal.use(vorpalLog);
FASTACK.logger = vorpal.logger;
FASTACK.vorpal = vorpal;

require('./directory.js')(FASTACK)
.then(require('./keys.js')(FASTACK))
.then(require('./localServer.js')(FASTACK))
.then(function() {
	vorpal.show();
})
;


vorpal
	.command('login', 'Authenticate to Fastack')
	.action(require('./commands/login.js')(FASTACK));

vorpal
	.command('logout', 'De-authenticate to Fastack')
	.action(require('./commands/logout.js')(FASTACK));

vorpal
	.command('register', 'Register an account with Fastack')
	.action(require('./commands/register.js')(FASTACK));

vorpal
	.command('init', 'Initialize the current directory as a Fastack app')
	.action(require('./commands/init.js')(FASTACK));

vorpal
	.command('start', 'start server')
	.action(function(args, callback) {
		FASTACK.localServer.start();
		callback()
	});

vorpal
	.command('stop', 'stop server')
	.action(function(args, callback) {
		FASTACK.localServer.stop();
		callback()
	});

vorpal
	.command('install [module]', 'install a module via JSPM')
	.action(require('./commands/install.js')(FASTACK));

vorpal
	.command('uninstall [module]', 'uninstall a module via JSPM')
	.action(require('./commands/uninstall.js')(FASTACK));

vorpal
	.command('list', 'list installed modules')
	.action(require('./commands/list.js')(FASTACK));

vorpal
	.command('build', 'trigger a build')
	.action(function(args, callback) {
		var start = new Date();
		FASTACK.localServer.build().then(function() {
			console.log(new Date() - start);
			callback();
		});
	});

vorpal
	.command('test', 'run something on Syncano')
	.action(function(args, callback) {
		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
		fastack.class('files').dataobject().list({}).then(function(data) {
			console.log(data);
			callback();
		})
	});


vorpal
	.delimiter('fastack:' + chalk.cyan(Path.basename(process.cwd())) + ' $');

vorpal.ui._sigint = function() {
	process.exit(0);
};

process.on('exit', function(code) {
	FASTACK.logger.confirm('Exiting Fastack.');
});

process.on('uncaughtException', function(err) {
	FASTACK.logger.error(err);
});