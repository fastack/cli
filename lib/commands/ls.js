const child_process = require('child_process')
	, through2 = require('through2')
	, fs = require('fs-extra')
	, Path = require('path')
	;

// could add options if we wanted (e.g. a '-l')
module.exports = function(FASTACK) {

	return function(args, callback) {

		var excludeHiddenDirs = through2.obj(function (item, enc, next) {
			var relPath = Path.relative(FASTACK.cwd, item.path);
			if (!(/(^|\/)\.[^\/\.]/g).test(relPath)) this.push(item);
			next();
		});

		var excludeDirFilter = through2.obj(function (item, enc, next) {
		  if (!item.stats.isDirectory()) this.push(item)
		  next()
		});
		
		var items = [];
		fs.walk(FASTACK.cwd)
				.pipe(excludeHiddenDirs)
				.pipe(excludeDirFilter)
				// .pipe(excludeIrrelevantFiles)
				.on('data', function(item) {
					items.push(item);
					FASTACK.logger.log(Path.basename(item.path));
					// onData(item);
				})
				.on('end', function() {
					// completed(items);
					// resolve(items);
				});
				callback();
	};

	// return function(args, callback) {
	// 	// child_process.exec(command[, options], callback)
	// 	child_process.exec("ls", function(error, stdout, stderr){
	// 		if(error) FASTACK.logger.error(stderr);
	// 		FASTACK.logger.log(stdout);
	// 	});
	// 	callback();
	// }
};