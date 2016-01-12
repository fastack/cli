const vorpal = require('vorpal')()
	, vorpalLog = require('vorpal-log')
	, chalk = require('chalk')
	, Path = require('path')
	, jspm = require('jspm')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, _ = require('lodash')
	, parseArgs = require('minimist')
	, fs = require('fs')
	, highlight = require('console-highlight')
	, console2 = require('console2')({disableWelcome: true, override: false})
;

require('console2')({disableWelcome: true});

var FASTACK = {
	argv: parseArgs(process.argv.slice(2), {
		alias: {
			'p': 'port'
		}
	})
};

//vorpal.use(vorpalLog);
//FASTACK.logger = vorpal.logger;

//console2.help();

FASTACK.logger = {
	log: function(msg) {
		console2.log(msg);
	},
	info: function(msg) {
		console2.log(msg);
	},
	error: function(msg) {
		console2.error(msg);
	},
	warn: function(msg) {
		console2.warn(msg);
	},
	confirm: function(msg) {
		console2.info(msg)
	},
	object: function(obj) {
		var root = console2.box();

		function traverse(obj, prev) {
			var box = prev.box();
			for (var key in obj) {
				if (typeof obj[key] === 'object') {
					box.line(chalk.cyan(key));
					traverse(obj[key], box);
				}
				else if (typeof  obj[key] === 'array') {
					for (var i in obj[key]) traverse(obj[key], box)
				}
				else box.line(key + ': ' + obj[key])
			}
			box.over();
			return prev;
		}

		traverse(obj, root).out();
	}
};

//FASTACK.logger.object({
//	hello: 'world',
//	sub1: {
//		level: 1,
//		something: 1,
//		sub2: {
//			level: 2,
//			sub3: {
//				level: 3
//			}
//		}
//	}
//})


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
	.command('rm <file-to-rm>', 'remove a file')
	.action(require('./commands/rm.js')(FASTACK));

 vorpal
 	.command('cd <dir-name>', 'change directory')
	 .autocompletion(function(text, iteration, cb) {
		 var files = fs.readdirSync(FASTACK.dir);
		 var list = [];
		 for (var f in files)
		    if (fs.lstatSync(Path.resolve(FASTACK.dir, files[f])).isDirectory()) list.push(files[f]);

		 if (iteration > 1) {
			 cb(void 0, list);
		 } else {
			 var match = this.match(text, list);
			 if (match) {
				 cb(void 0, 'cd ' + match);
			 } else {
				 cb(void 0, void 0);
			 }
		 }
	 })
 	.action(require('./commands/cd.js')(FASTACK));

vorpal
	.command('pwd', 'list current path within app')
	.action(require('./commands/pwd.js')(FASTACK));

vorpal
	.command('cat <file-name>', 'show the contents of a file')
	.action(require('./commands/cat.js')(FASTACK));

vorpal
	.command('open <file-name>', 'open a file')
	.action(require('./commands/open.js')(FASTACK));

vorpal
	.command('mv <src> <dst>', 'move a file')
	.action(require('./commands/mv.js')(FASTACK));

// vorpal
// 	.command('emacs <file-name>')
// 	.action(require('./commands/emacs.js')(FASTACK));
// for some reason, mv will not remove the file from the current dir

// vorpal
// 	.catch('[commands...]', 'All other commands')
// 	.action(function (args, callback) {
// 		var child = exec(args.commands.join(' '), {cwd: FASTACK.cwd}, (error, stdout, stderr) => {
// 			this.log(stdout);
// 			callback();
// 		});
// 	});

//vorpal
//	.command('deploy [app-name]', 'deploy to Syncano')
//	.action(require('./commands/deploy.js')(FASTACK));


//vorpal
//	.command('new_app [app_name]', 'create a new fastack app')
//	.action(require('./commands/new_app.js')(FASTACK));

//vorpal
//	.command('export [directory]', 'export your Fastack application')
//	.action(require('./commands/export.js')(FASTACK));



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