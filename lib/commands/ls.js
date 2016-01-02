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

		var excludeSubDirFiles = through2.obj(function (item, enc, next) {
			if( (Path.basename( Path.parse( item.path ).dir ) === Path.basename( FASTACK.cwd ) ) ) this.push(item);
			next();
		});
		
		var items = [];
		fs.walk(FASTACK.cwd)
				.pipe(excludeHiddenDirs)
				.pipe(excludeSubDirFiles)
				.on('data', function(item) {
					FASTACK.logger.log( Path.basename(item.path) );
				})
				.on('end', function() {

				});
				callback();
	};

};