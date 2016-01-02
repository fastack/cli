const child_process = require('child_process')
	, fs = require('fs-extra')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {
	return function(args, callback) {

		var src = args["src"];
		var dst = args["dst"];

		fs.copy(src, dst, function (err) {
		  if (err) return console.error(err)
		  console.log("success!")
		}) // copies file

		// child_process.exec(command[, options], callback)
		// var command = "cp " + args["src"] + " " + args["dst"];
		// child_process.exec(command, function(error, stdout, stderr){
		// 	if(error) FASTACK.logger.error(stderr);
		// 	FASTACK.logger.log(stdout);
		// });
		// callback();
	}
};