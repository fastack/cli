const child_process = require('child_process')
	, fs = require('fs-extra')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {

		var file_or_dir_to_rm = args["file-to-rm"];
		fs.remove(file_or_dir_to_rm, function (err) {
		  if (err) return console.error(err)
		  FASTACK.logger.log('file/dir removed.')
		})

		// child_process.exec(command[, options], callback)
		// var command = "rm " + args["file-to-rm"];
		// child_process.exec(command, function(error, stdout, stderr){
		// 	if(error) FASTACK.logger.error(stderr);
		// 	FASTACK.logger.log(stdout);
		// });
		callback();
	}
};