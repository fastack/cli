const child_process = require('child_process')
	, fs = require('fs-extra')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {

		fs.createOutputStream(args["file-name"]);

		callback();
	}
};