const cheerio = require('cheerio')
	, fs = require('fs-extra')
	, Path = require('path')
	, Promise = require('bluebird')
;

module.exports = function(FASTACK) {
	var configString = "System.config({paths: {'fastack:*': '.fastack/fastack-packages/*'}});";

	return function(html, hash) {
		var $ = cheerio.load(html);

		$('head').append('<script type="application/javascript" src="/.fastack/system-js/system.js?'+hash+'"></script>');
		$('head').append('<script type="application/javascript" src="/.fastack/config.js?'+hash+'"></script>');
		$('head').append('<script type="application/javascript">' + configString + '</script>');

		//$('head').append('<script type="application/javascript" src="/.fastack/builds/fastack.js?'+hash+'"></script>');
		//$('head').append('<link rel="stylesheet" href="/.fastack/builds/fastack.css?'+hash+'" />');

		return new Promise((resolve, reject) => {
			var str = '';
			FASTACK.getLocalDeps().then((deps) => {
				deps.unshift('fastack:dev/live-reload');
				for (var i in deps) {
					str += "System.import('"+Path.relative(FASTACK.cwd, deps[i])+"');\n";
				}
				$('head').append('<script type="application/javascript">' + str + '</script>');
				resolve($.html());
			});
		})
	}
};