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
				'less',
				'js'
			];

			function getSuffix(ext) {
				switch(ext) {
					case ".css": return "!plugin-css";
					case ".sass": return "!plugin-sass";
					case ".scss": return "!plugin-sass";
					case ".js": return "";
					default: return "!";
				}
			}

			var out = [];

			FASTACK.traverse(FASTACK.cwd, allowable, function(file) {
				out.push(file.path + getSuffix(Path.extname(file.path)));
			}).then(function() {
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
			separateCSS: true
		});

		if (!production) {
			builder.config({
				paths: {
					'fastack:*': Path.resolve(FASTACK.localDir, 'fastack-packages/*')
				}
			})
		}

		return new Promise(function(resolve, reject) {
			if (!production) resolve();
			else {
				var hash = FASTACK.hash;
				FASTACK.getLocalDeps()
				.then((str) => {
					str = str.map((path) => Path.relative(FASTACK.cwd, path));
					str = str.join(' + ');
					builder.buildStatic(str, Path.join(FASTACK.localDir, 'builds/'+hash+'/'+hash+'.js'), {
							minify: false,
							sourceMaps: true,
							//mangle: production,
							//lowResSourceMaps: !production
							format: 'global'
						})
						.then(function (data) {
							//FASTACK.logger.info(hash);
							resolve(FASTACK.hash);
						}).catch(function (e) {
						console.log(e);
						reject(e);
					})
				})
			}
		});
	};

	if (FASTACK.app) return FASTACK.build();
	else
		return new Promise(function(resolve, reject) {
			resolve();
		});
};