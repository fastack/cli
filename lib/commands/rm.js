const fs = require('fs-extra')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {


		var file = args["file"];
		FASTACK.shell.rm(file);


		callback();
	}
};