const clui = require('clui')
	, Spinner = clui.Spinner
	, os = require('os')
	, Path = require('path')
	, fs = require('fs-extra')
	, Promise = require('bluebird')
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Initializing Fastack app in ' + chalk.cyan(FASTACK.cwd));
		spinner.start();
		fs.ensureDirSync(FASTACK.localDir);
		fs.ensureDirSync(Path.resolve(FASTACK.localDir, 'jspm_packages'));
		fs.ensureDirSync(Path.resolve(FASTACK.localDir, 'builds'));

		var toCopy = Path.resolve(__dirname, '../.fastack/');

		try {
			fs.copySync(Path.resolve(toCopy, 'package.base.json'), Path.resolve(FASTACK.localDir, 'package.json'));
			fs.copySync(Path.resolve(toCopy, 'config.base.js'), Path.resolve(FASTACK.localDir, 'config.js'));
			fs.copySync(Path.resolve(toCopy, 'fastack-packages/dev'), Path.resolve(FASTACK.localDir, 'fastack-packages/dev'));
			fs.ensureFileSync(Path.resolve(FASTACK.localDir, 'fastack-packages/main.js'));
		} catch(e) {
			FASTACK.logger.error(e)
		}

		try {
			jspm.setPackagePath(FASTACK.localDir);
			jspm.install(true, { lock: true }).then(function() {
				spinner.stop();
				FASTACK.logger.info('Fastack app initialized.');
				FASTACK.app = true;

				FASTACK.localServer.stop();
				FASTACK.localServer.start();

				callback();
			}).catch(function(e) {
				spinner.stop();
				FASTACK.logger.error(e);
				callback();
			});

		} catch(e) {
			FASTACK.logger.error(e);
			callback();
		}
	};
};