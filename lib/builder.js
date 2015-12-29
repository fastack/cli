const clui = require('clui')
	, Spinner = clui.Spinner
	, Path = require('path')
	, fs = require('fs')
	, crypto = require('crypto')
	, Promise = require('bluebird')
	, jspm = require('jspm')
	;

module.exports = function(FASTACK) {

	var _buildString = function() {
		return new Promise(function(resolve, reject) {
			var allowable = [
				'css',
				'coffee'
			];

			FASTACK.traverse(FASTACK.cwd, allowable, function(file) {

			}).then(function(files) {
				var str = '* + fastack:dev/live-reload';
				for (var i in files) {
					var file = files[i];
					str += ' + ' + Path.relative(FASTACK.cwd, file.path) + '!'
				}
				resolve(str);
			});
		});
	};



	FASTACK.build = function() {
		FASTACK.hash = crypto.createHash('md5').update((new Date()).toString()).digest('hex');

		jspm.setPackagePath(FASTACK.localDir);
		var configFile = Path.resolve(FASTACK.localDir, 'config.js');

		var builder = new jspm.Builder();

		builder.loadConfigSync(configFile, true, true);
		builder.config({
			buildCSS: true,
			separateCSS: true,
			paths: {
				'fastack:*': Path.resolve(FASTACK.localDir, 'fastack-packages/*')
			}
		});

		return new Promise(function(resolve, reject) {
			_buildString()
			.then(function (str) {
				builder.buildStatic(str, Path.join(FASTACK.localDir, 'builds/fastack.js'), {
						//minify: true,
						sourceMaps: true,
						//mangle: true,
						lowResSourceMaps: true
					})
					.then(function (data) {
						resolve();
					}).catch(function (e) {
						reject(e);
				})
			});
		});
	};


	return new Promise(function(resolve, reject) {

		resolve();
	});
};