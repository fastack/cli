const fs = require('fs')
	, Path = require('path')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	;

module.exports = function(FASTACK) {
	FASTACK.getInstalled = () => {
		var package = JSON.parse(fs.readFileSync(Path.join(FASTACK.localDir, 'package.json'), 'utf8'));
		var deps = package.jspm.dependencies;
		return deps;
	};
	return function(args, callback) {
		try {
			var deps = FASTACK.getInstalled();
			for (var module in deps) {
				FASTACK.logger.info(chalk.cyan(module) + ': ' + deps[module]);
			}
			callback();
		} catch (e) {
			FASTACK.logger.error(e);
		}
	}
};