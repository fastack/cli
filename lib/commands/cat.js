const Path = require('path')
	, fs = require('fs')
;

module.exports = function(FASTACK) {
	return function(args, callback) {

		try {
			var file = fs.readFileSync(Path.resolve(FASTACK.dir, args["file"]), 'utf8');
			console.log(file);
		} catch(e) {
			if (e.code == 'ENOENT') FASTACK.logger.error('File not found!');
			else if (e.code == 'EISDIR') FASTACK.logger.error('That\'s a directory!');
			else {
				FASTACK.logger.error(e);
			}
		}
		callback();
	}
};