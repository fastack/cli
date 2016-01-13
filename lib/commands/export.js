const fs = require('fs-extra')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, Path = require('path')
	, Promise = require('bluebird')
	;

module.exports = function(FASTACK) {

	return function(args, callback) {
		var spinner = new Spinner('Exporting...');
		spinner.start();

		FASTACK.export(args['dir']).then((files) => {
			spinner.stop();
			FASTACK.logger.confirm(files.length + ' files exported.');
			callback();
		})

	}
};