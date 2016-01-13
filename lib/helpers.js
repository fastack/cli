const shell = require('shelljs')
	, console2 = require('console2')({disableWelcome: true, override: false})
	, Promise = require('bluebird')
	, Path = require('path')
	, fs = require('fs-extra')
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
					FASTACK.traverse(FASTACK.cwd, true).then((files) => {
						for (var f in files) {
							var path = files[f].path;
							var isDir = fs.lstatSync(path).isDirectory();

							if (path.indexOf('/.fastack/') == -1 && !isDir) {
								fs.copySync(path, Path.resolve(dest, Path.relative(FASTACK.cwd, path)))
							}
						}

						fs.copySync(dest, ultDest);

						FASTACK.traverse(ultDest, ['html']).then((htmlFiles) => {
							for (var f in htmlFiles) {
								var path = htmlFiles[f].path;
								if (Path.extname(path) == '.html') {
									var newHtml = require('./htmlBuild')(FASTACK).prod(fs.readFileSync(path, 'utf8'), hash);
									fs.outputFileSync(path, newHtml, 'utf8')
								}
							}
							resolve(files);
						})
					})
				})
		})
	};


	return new Promise(function(resolve, reject) {
		resolve();
	});
};