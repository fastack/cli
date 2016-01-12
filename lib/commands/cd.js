const Path = require('path')
	, fs = require('fs')
;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var newDir = Path.resolve(FASTACK.dir, args["dir-name"]);

		try {
			var newDirStat = fs.statSync(newDir);
			if (!newDirStat.isDirectory()) {
				FASTACK.logger.error(FASTACK.logger.error('That\'s not a directory!'));
				callback();
			}
			else if (Path.relative(FASTACK.cwd, newDir).indexOf('..') != -1) {
				FASTACK.logger.error('Cannot leave your application directory!');
				callback();
			}
			else {
				FASTACK.dir = newDir;
				FASTACK.updateDelimiter();
				callback();
			}
		} catch(e) {
			if (e.code == 'ENOENT') FASTACK.logger.error(FASTACK.logger.error('Directory does not exist!'));

			callback();
		}
	}
};