const cheerio = require('cheerio')
	, fs = require('fs-extra')
;

module.exports = function(FASTACK) {
	return function(html, hash) {
		var $ = cheerio.load(html);

		$('head').append('<script type="application/javascript" src="/.fastack/builds/fastack.js?'+hash+'"></script>');
		$('head').append('<link rel="stylesheet" href="/.fastack/builds/fastack.css?'+hash+'" />');
		return $.html();
	}
};