const child_process = require('child_process')
	, fs = require('fs-extra')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {
	return function(args, callback) {

		var src = args["src"];
		var dst = args["dst"];
		// child_process.exec(command[, options], callback)
		var command = "mv " + args["src"] + " " + args["dst"];
		child_process.exec(command, function(error, stdout, stderr){
			if(error) FASTACK.logger.error(stderr);
			FASTACK.logger.log(stdout);
		});
		
		// fs.move(src, dst, function (err) {
		//   if (err) return FASTACK.logger.log(err);
		//   FASTACK.logger.log("success!");
		// })
		callback();
	}
};