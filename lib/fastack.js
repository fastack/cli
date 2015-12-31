const vorpal = require('vorpal')()
	, vorpalLog = require('vorpal-log')
	, chalk = require('chalk')
	, Syncano = require('syncano')
	, Path = require('path')
	, jspm = require('jspm')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, _ = require('lodash')
	, exec = require('child_process').exec
	, parseArgs = require('minimist')
;

var FASTACK = {
	argv: parseArgs(process.argv.slice(2), {
		alias: {
			'p': 'port'
		}
	})
};

vorpal.use(vorpalLog);
FASTACK.logger = vorpal.logger;
FASTACK.vorpal = vorpal;

var spinner = new Spinner('Starting Fastack...');
spinner.start();
require('./directory.js')(FASTACK)
.then(() => {
	spinner.message('Fetching Fastack API keys...');
	return require('./keys.js')(FASTACK)})
.then(() => {
	spinner.message('Loading builder...');
	return require('./builder.js')(FASTACK)})
.then(() => {
	spinner.message('Starting local server...');
	return require('./localServer.js')(FASTACK)
})
.finally(() => {
	spinner.stop();

	if (!FASTACK.app) {
		FASTACK.logger.warn('The current directory is not a Fastack application');
		FASTACK.logger.info('To initialize a Fastack app in this directory, run \'init\'');
	}

	if (!FASTACK.userKey) {
		FASTACK.logger.info('Not logged into Fastack. Authenticate by running \'login\'');
	}

	if (FASTACK.localServer && FASTACK.localServer.server) {
		var port = FASTACK.localServer.server.address().port;
		FASTACK.logger.info('Local server now running on port ' + chalk.red(port) + ': ' + chalk.cyan('http://localhost:'+port) + '/');
	}

	FASTACK.logger.info(FASTACK.argv);

	vorpal.show();
}).catch((e) => {
	spinner.stop();
	FASTACK.logger.error(e);
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
	.autocompletion(function(text, iteration, cb) {
		var installed = _.keys(FASTACK.getInstalled());
		if (iteration > 1) {
			cb(void 0, installed);
		} else {
			var match = this.match(text, installed);
			if (match) {
				//console.log(match)
				cb(void 0, 'uninstall ' + match);
			} else {
				cb(void 0, void 0);
			}
		}
	})
	.action(require('./commands/uninstall.js')(FASTACK));

vorpal
	.command('list', 'list installed modules')
	.action(require('./commands/list.js')(FASTACK));

vorpal
	.command('build', 'trigger a build')
	.action(function(args, callback) {
		var spinner = new Spinner('Building application...');
		spinner.start();
		var start = new Date();
		FASTACK.build().then(function() {
			spinner.stop();
			var t = new Date() - start;
			FASTACK.logger.info('Build time: ' + t + ' ms.');
			callback();
		}).catch((e) => {
			spinner.stop();
			FASTACK.logger.error(e);
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
	.command('deploy [app-name]', 'deploy to Syncano')
	.action(require('./commands/deploy.js')(FASTACK));

vorpal
	.catch('[commands...]', 'All other commands')
	.action(function (args, callback) {
		var child = exec(args.commands.join(' '), {cwd: FASTACK.cwd}, (error, stdout, stderr) => {
			this.log(stdout);
			callback();
		});
	});


vorpal
	.delimiter('fastack:' + chalk.cyan(Path.basename(process.cwd())) + ' $');

vorpal.find('exit').remove();

vorpal.ui._sigint = function() {
	process.exit(0);
};

process.on('exit', function(code) {
	FASTACK.logger.confirm('Exiting Fastack.');
});

process.on('uncaughtException', function(err) {
	FASTACK.logger.error(err);
});