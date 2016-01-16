const child_process = require('child_process')
	, fs = require('fs-extra')
	, Path = require('path')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {
	return function(args, callback) {

		// if a file already exists, this command will just overwrite it right now

		var src = args["src"];
		var dst = args["dst"];

		var dataToCopy = fs.readFile(src, function(err, data){
		    if (err){
		        FASTACK.logger.log(err);
		    }
		});

		var fileName = Path.basename(src);
		if( fs.existsSync(dst) && fs.lstatSync(dst).isDirectory() ){
			var fileName = Path.basename(src);
			dst = dst + "/" + fileName;
		}
		var fd = fs.openSync(dst, 'w');

		fs.write(fd, dataToCopy, function(err) {
		    if(err) {
		        FASTACK.logger.log(err);
		    }
		    FASTACK.logger.log("File copied.");
		});

		callback();
	}
};