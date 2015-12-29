const clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Uninstalling ' + chalk.cyan(args.module));
		spinner.start();

		var updateSpinner = function(type, msg) {
			spinner.message(msg);
		};

		jspm.on('log', updateSpinner);

		jspm.uninstall(args.module).then(function() {
			spinner.stop();
			FASTACK.vorpal.exec('list');
			FASTACK.build().then(function() {
				jspm.removeListener('log', updateSpinner);
				callback();
			}).catch((e) => {
				spinner.stop();
				FASTACK.logger.error(e);
				callback();
			});
		}).catch((e) => {
			spinner.stop();
			FASTACK.logger.error(e);
			callback();
		});
	}
};