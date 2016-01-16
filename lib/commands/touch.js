const Path = require('path')
	, fs = require('fs-extra')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {

		try {
			fs.closeSync(fs.openSync(Path.resolve(FASTACK.dir, args["file-name"]), 'w'));
			FASTACK.vorpal.exec('ls');
		} catch (e) {
			FASTACK.logger.error('Could not create file!');
		}

		callback();
	}
};