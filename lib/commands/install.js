const fs = require('fs')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Installing ' + chalk.cyan(args.module || 'dependencies'));
		spinner.start();

		jspm.install(args.module || true).then(function() {
			spinner.stop();
			FASTACK.vorpal.exec('list');
			FASTACK.build().then(function() {
				callback();
			});
		});
	}
};