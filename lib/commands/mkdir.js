const child_process = require('child_process')
	, fs = require('fs-extra')
;

module.exports = function(FASTACK) {
	return function(args, callback) {

		var dir = args["dir-name"];
		fs.mkdirs(dir, function (err) {
		  if (err) return FASTACK.logger.error(err)
		  FASTACK.logger.log("directory created.")
		});

		// child_process.exec(command[, options], callback)
		// var command = "mkdir " + args["dir-name"];
		// console.log(command);
		// child_process.exec(command, function(error, stdout, stderr){
		// 	if(error) FASTACK.logger.error(stderr);
		// 	FASTACK.logger.log(stdout);
		// });
		callback();
	}
};