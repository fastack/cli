const child_process = require('child_process')
	, fs = require('fs-extra')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {

		// if /tmp/some does not exist, it is created
		fs.createOutputStream(args["file-name"]);
		// child_process.exec(command[, options], callback)
		// var command = "touch " + args["file-name"];
		// child_process.exec(command, function(error, stdout, stderr){
		// 	if(error) FASTACK.logger.error(stderr);
		// 	FASTACK.logger.log(stdout);
		// });
		callback();
	}
};