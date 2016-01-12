const clui = require('clui')
	, Spinner = clui.Spinner
	, Path = require('path')
	, fs = require('fs')
	, crypto = require('crypto')
	, Promise = require('bluebird')
	, jspm = require('jspm')
	;

module.exports = function(FASTACK) {

	FASTACK.getLocalDeps = function() {
		return new Promise(function(resolve, reject) {
			var allowable = [
				'css',
				'coffee',
				'sass',
				'scss',
				'less'
			];

			function getSuffix(ext) {
				switch(ext) {
					case ".css": return "plugin-css";
					case ".sass": return "plugin-sass";
					case ".scss": return "plugin-sass";
					default: return "";
				}
			}

			var out = [];

			FASTACK.traverse(FASTACK.cwd, allowable, function(file) {
				out.push(file.path + '!' + getSuffix(Path.extname(file.path)));
			}).then(function(files) {
				var str = '* + fastack:dev/live-reload';
				for (var i in files) {
					var file = files[i];
					str += ' + ./' + Path.relative(FASTACK.cwd, file.path) + '!' + getSuffix(Path.extname(file.path))
				}
				resolve(out);
			});
		});
	};



	FASTACK.build = function(production) {
		production = !!production;
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
			resolve();
			//_buildString()
			//.then(function (str) {
			//	builder.buildStatic(str, Path.join(FASTACK.localDir, 'builds/fastack.js'), {
			//			minify: production,
			//			sourceMaps: true,
			//			mangle: production,
			//			lowResSourceMaps: !production
			//		})
			//		.then(function (data) {
			//			resolve();
			//		}).catch(function (e) {
			//			reject(e);
			//	})
			//});
		});
	};

	if (FASTACK.app) return FASTACK.build();
	else
		return new Promise(function(resolve, reject) {
			resolve();
		});
};