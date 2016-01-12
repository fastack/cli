const fs = require('fs')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Exporting...');
		spinner.start();

		FASTACK.build(true)
		.then(() => {
			var allowable = ['html'];
			return FASTACK.traverse(FASTACK.cwd, allowable, (file) => {
				FASTACK.logger.info(file);
			});
		}).then(() => {
			spinner.stop();
			callback();
		})

	}
};