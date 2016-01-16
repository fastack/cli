const Path = require('path')
	, fs = require('fs')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		FASTACK.logger.info(Path.relative(FASTACK.cwd, FASTACK.dir) || '/');
		callback();
	}
};