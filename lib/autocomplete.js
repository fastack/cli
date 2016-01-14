const Path = require('path')
	, fs = require('fs')
;

module.exports = function(FASTACK, COMMAND) {
	return function (text, iteration, cb) {
		var files = fs.readdirSync(FASTACK.dir);
		var list = [];
		for (var f in files)
			if (fs.lstatSync(Path.resolve(FASTACK.dir, files[f])).isDirectory()) list.push(files[f]);

		if (iteration > 1) {
			cb(void 0, list);
		} else {
			var match = this.match(text, list);
			if (match) {
				cb(void 0, COMMAND + " " + match);
			} else {
				cb(void 0, void 0);
			}
		}
	}
};