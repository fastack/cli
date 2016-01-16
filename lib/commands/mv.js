const child_process = require('child_process')
	, fs = require('fs-extra')
	, Path = require('path')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {
	return function(args, callback) {

		var src = args["src"];

		// read contents of file to copy
		var dataToCopy = fs.readFile(src, function(err, data){
		    if (err){
		        FASTACK.logger.log(err);
		    }
		});

		// remove old file
		fs.remove(src, function (err) {
		  if (err) return console.error(err)
		});

		var dst = args["dst"];

		if( fs.existsSync(dst) && fs.lstatSync(dst).isDirectory() ){
			var fileName = Path.basename(src);
			dst = dst + "/" + fileName;
		}
		// create file
		var fd = fs.openSync( dst, 'w');
		// copy data into new file
		fs.write(fd, dataToCopy, function(err) {
		    if(err) {
		        FASTACK.logger.log(err);
		    }
		    FASTACK.logger.log("File moved.");
		});
		
		callback();

	}
};