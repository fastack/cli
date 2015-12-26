const fs = require('fs')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Installing ' + chalk.cyan(args.module));
		spinner.start();
		jspm.install(args.module).then(function() {
			spinner.stop();
			FASTACK.vorpal.exec('list');
			FASTACK.localServer.build().then(function() {
				callback();
			});
		});
	}
};