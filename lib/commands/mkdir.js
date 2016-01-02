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
		
		callback();
	}
};