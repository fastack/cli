const open = require('open')
;

module.exports = function(FASTACK) {
	return function(args, callback) {
		open(args["path-or-url"]);
		callback();
	}
};