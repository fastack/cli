const fs = require('fs-extra')
	, Path = require('path')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {

		var file = Path.relative(FASTACK.dir, args["file"]);
		if (args.options && args.options.force) fs.removeSync(file);
		else FASTACK.shell.rm(file);

		callback();
	}
};