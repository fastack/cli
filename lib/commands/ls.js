const fs = require('fs-extra')
	, Path = require('path')
	, chalk = require('chalk')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {

	return function(args, callback) {

		var files = fs.readdirSync(FASTACK.dir);
		for (var f in files) {
			var file = files[f];
			var stat = fs.lstatSync(Path.resolve(FASTACK.dir, file));

			if (stat.isDirectory()) FASTACK.logger.info(chalk.cyan(file));
			else FASTACK.logger.info(file);

		}

		callback();

	};

};