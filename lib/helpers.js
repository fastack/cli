const shell = require('shelljs')
	, console2 = require('console2')({disableWelcome: true, override: false})
	, Promise = require('bluebird')
	, Path = require('path')
	, fs = require('fs-extra')
	, walkSync = require('walk-sync')
	, Syncano = require('syncano')
	;

shell.log = function() {
	FASTACK.logger.info.apply(this, arguments);
};

module.exports = function(FASTACK) {

	FASTACK.shell = shell;
	FASTACK.console2 = console2;

	FASTACK.logger = {
		log: function(msg) {
			console2.log(msg);
		},
		info: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			console2.log(msg);
		},
		error: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			if (typeof msg === 'object') msg = msg.toString();
			console2.error(msg);
		},
		warn: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
			console2.warn(msg);
		},
		confirm: function(msg) {
			if (typeof msg === 'string') msg = msg.replace(/\n+$/, "");
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

	console.log = function(msg) {
		FASTACK.logger.info(msg);
	};

	FASTACK.export = function(dir) {
		return new Promise((resolve, reject) => {
			FASTACK.build(true)
				.then((hash) => {
					var dest =  Path.resolve(FASTACK.localDir, 'builds/', hash);
					var ultDest = Path.relative(FASTACK.cwd, dir);

					var appFiles = walkSync(FASTACK.cwd, {
						globs: ["**"],
						directories: false
					});

					for (var f in appFiles) {
						var file = appFiles[f];
						fs.copySync(file, Path.resolve(dest, Path.relative(FASTACK.cwd, file)));
					}
					fs.copySync(dest, ultDest);

					var files = walkSync(ultDest, {directories: false});

					for (var f in files) {
						var file = Path.resolve(ultDest, files[f]);
						if (Path.extname(file) == '.html') {
							var newHtml = require('./htmlBuild')(FASTACK).prod(fs.readFileSync(file, 'utf8'), hash);
							fs.outputFileSync(file, newHtml, 'utf8');
						}
					}

					resolve(ultDest);
				})
		})
	};

	FASTACK.getUserId = () => new Promise((resolve, reject) => {
		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
		fastack.class('user_profile').dataobject().list()
		.then((u) => resolve(u.objects[0].owner))
	});


	return new Promise(function(resolve, reject) {
		resolve();
	});
};