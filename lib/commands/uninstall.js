const clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Uninstalling ' + chalk.cyan(args.module));
		spinner.start();

		jspm.uninstall(args.module).then(function() {
			spinner.stop();
			FASTACK.vorpal.exec('list');
			FASTACK.build().then(function() {
				callback();
			});
		});
	}
};