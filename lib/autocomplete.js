const Path = require('path')
	, fs = require('fs')
	, walkSync = require('walk-sync')
	, _ = require('lodash')
;

module.exports = function(FASTACK, COMMAND) {
	return function (text, iteration, cb) {
		var opts = {directories: true, globs: ["**"]};

		switch (COMMAND) {
			case 'cd':
				//opts.globs = ["(**/*.*)"];
				opts.dot = false;
				break;
			case 'cat':
				opts.directories = false;
				break;
		}

		var list = walkSync(FASTACK.dir, opts);

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