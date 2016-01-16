const vorpal = require('vorpal')()
	, chalk = require('chalk')
	, jspm = require('jspm')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, _ = require('lodash')
	, parseArgs = require('minimist')
	, fs = require('fs')
;

var FASTACK = {
	argv: parseArgs(process.argv.slice(2), {
		alias: {
			'p': 'port'
		}
	})
};


FASTACK.vorpal = vorpal;

var spinner = new Spinner('Starting Fastack...');
spinner.start();
require('./directory.js')(FASTACK)
.then(() => {
	spinner.message('Fetching Fastack API keys...');
	return require('./keys.js')(FASTACK)})
.then(() => {
	spinner.message('Loading helpers...');
	return require('./helpers.js')(FASTACK)})
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
	.command('install [module] [target]', 'install a module via JSPM')
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
		FASTACK.build(true).then(function() {
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
	.command('export <dir>', 'export application')
	.action(require('./commands/export.js')(FASTACK));

vorpal
	.command('ls', 'list contents of current dir')
	// .option('-l, --long', 'Long output.')
	.action(require('./commands/ls.js')(FASTACK));

vorpal
	.command('mkdir <dir-name>', 'create a new directory')
	.action(require('./commands/mkdir.js')(FASTACK));

vorpal
	.command('touch <file-name>', 'create a new file')
	.action(require('./commands/touch.js')(FASTACK));

vorpal
	.command('cp <src> <dst>', 'copy a file')
	.action(require('./commands/cp.js')(FASTACK));

vorpal
	.command('rm <file>', 'remove a file')
	.option('-f, --force', 'remove a directory and its contents')
	.autocompletion(require('./autocomplete.js')(FASTACK,'rm'))
	.action(require('./commands/rm.js')(FASTACK));

 vorpal
 	.command('cd <dir-name>', 'change directory')
	.autocompletion(require('./autocomplete.js')(FASTACK,'cd'))
 	.action(require('./commands/cd.js')(FASTACK));

vorpal
	.command('pwd', 'list current path within app')
	.action(require('./commands/pwd.js')(FASTACK));

vorpal
	.command('cat <file>', 'show the contents of a file')
	.autocompletion(require('./autocomplete.js')(FASTACK,'cat'))
	.action(require('./commands/cat.js')(FASTACK));

vorpal
	.command('open <path-or-url>', 'open a path or url')
	.autocompletion(require('./autocomplete.js')(FASTACK,'open'))
	.action(require('./commands/open.js')(FASTACK));

vorpal
	.command('mv <src> <dst>', 'move a file')
	.action(require('./commands/mv.js')(FASTACK));

vorpal
	.command('add_host <host-name>', 'add a new host')
	.action(require('./commands/add_host.js')(FASTACK));

vorpal
	.command('deploy <app-name>', 'deploy to Syncano')
	.action(require('./commands/deploy.js')(FASTACK));


//vorpal
//	.command('new_app [app_name]', 'create a new fastack app')
//	.action(require('./commands/new_app.js')(FASTACK));



vorpal.find('exit').remove();

vorpal.ui._sigint = function() {
	process.exit(0);
};

process.on('exit', function(code) {
	FASTACK.logger.confirm('Exiting Fastack.');
});

process.on('uncaughtException', function(err) {
	console.error(err);
	//FASTACK.logger.error(err);
});