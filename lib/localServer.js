const clui = require('clui')
	, Spinner = clui.Spinner
	, FastackDelivery = require('fastack-deliver-middleware')
	, Promise = require('bluebird')
	, connect = require('connect')
	, http = require('http')
	, chalk = require('chalk')
	, Path = require('path')
	, fs = require('fs-extra')
	, mime = require('mime')
	, jspm = require('jspm')
	, chokidar = require('chokidar')
	, crypto = require('crypto')
	, Syncano = require('syncano')
	;

function LocalServer(FASTACK) {
	this.FASTACK = FASTACK;
	jspm.setPackagePath(FASTACK.localDir);
}

var sendFile = function(FASTACK){
	return function(req, res, next) {
		var routed = req.FASTACK.routed;

		if (routed && routed.type == 'redirect') {
			res.statusCode = routed.code;
			res.setHeader('Location', routed.path);
			res.end();
			next();
		}

		else if (routed && routed.type == 'file') {
			try {
				var filePath = Path.join(FASTACK.cwd, routed.path);
				var contents = fs.readFileSync(filePath);
				if (FASTACK.app && Path.extname(filePath) == '.html') contents = require('./htmlBuild.js')(FASTACK)(contents, FASTACK.hash);
				res.setHeader('Content-Type', mime.lookup(routed.path));
				res.end(contents, 'binary');
			} catch(e) {
				//FASTACK.logger.error(e);
				next();
			}
		}

		else next();

	}
};

LocalServer.prototype._buildPlugins = function() {
	var FASTACK = this.FASTACK;
	return new Promise(function(resolve, reject) {
		var main = Path.resolve(FASTACK.localDir, 'fastack-packages/main.js');
		var allowable = [
			'css',
			'coffee'
		];

		FASTACK.traverse(FASTACK.cwd, allowable, function(file) {

		}).then(function(files) {
			var js = '';
			for (var i in files) {
				var file = files[i];
				js += 'require(\"../../'+Path.relative(FASTACK.cwd, file.path)+'!\");\n';
			}
			fs.writeFileSync(main, js, 'utf8');
			resolve();
		});
	});
};

LocalServer.prototype._buildString = function() {
	var FASTACK = this.FASTACK;
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
			//FASTACK.logger.info(str);
			resolve(str);
		});
	});
};

LocalServer.prototype.build = function() {
	var FASTACK = this.FASTACK;
	var self = this;
	FASTACK.hash = crypto.createHash('md5').update((new Date()).toString()).digest('hex');
	return new Promise(function(resolve, reject) {
		var builder = new jspm.Builder();
		builder.config({
			buildCSS: true,
			separateCSS: true,
			paths: {
				'fastack:*': Path.resolve(FASTACK.localDir, 'fastack-packages/*')
			}
		});
		//self._buildPlugins().then(function() {
		//
		//	builder.buildStatic('* + fastack:main + fastack:dev/live-reload', Path.join(FASTACK.localDir, 'builds/fastack.js'), {
		//				minify: true,
		//				sourceMaps: true,
		//				mangle: true
		//	})
		//	.then(function(data) {
		//		resolve();
		//	}).catch(function(e) {
		//		FASTACK.logger.error('Problem with build: ' + e);
		//		resolve();
		//	})
		//});
		self._buildString().then(function(str) {
			builder.buildStatic(str, Path.join(FASTACK.localDir, 'builds/fastack.js'), {
						minify: true,
						sourceMaps: true,
						mangle: true
					})
					.then(function(data) {
						resolve();
					}).catch(function(e) {
				FASTACK.logger.error('Problem with build: ' + e);
				resolve();
			})
		});
	})
};

LocalServer.prototype.start = function() {
	var FASTACK = this.FASTACK;
	var req = {FASTACK: {}};
	FastackDelivery.configure('development')(req, null, function() {});
	FASTACK.config = req.FASTACK.config;

	var self = this;

	var fastackServer = connect();

	fastackServer.use(function(req, res, next) {
		req.FASTACK = {};
		req.FASTACK.config = FASTACK.config;
		next();
	});

	fastackServer.use(FastackDelivery.configure('development'));
	fastackServer.use(FastackDelivery.route());
	fastackServer.use(sendFile(FASTACK));
	//fastackServer.use(function(req, res, next) {
	//	res.end(JSON.stringify(req.FASTACK));
	//});
	fastackServer.use(FastackDelivery.notFound());


	var port = FASTACK.config.local.port;
	var server = http.createServer(fastackServer).listen(port);

	this.server = server;

	if (FASTACK.app) {

		var io = require('socket.io')(server);

		var watcher = chokidar.watch(FASTACK.cwd, {
			ignored: /[\/\\]\./,
			persistent: true,
			ignoreInitial: true
		});

		this.watcher = watcher;

		var spinner = new Spinner('Reloading clients');
		watcher.on('all', function(event, path) {
			var socket = io;
			spinner.start();
			self.build().then(function() {
				var css = Path.extname(path) == '.css';
				if (css) socket.emit('reload-css');
				else socket.emit('reload');

				spinner.stop();
				FASTACK.vorpal.ui.redraw.done();
			});
		});

	}

	FASTACK.logger.info('Local server now running on port ' + chalk.red(port) + ': ' + chalk.cyan('http://localhost:'+port) + '/');

};

LocalServer.prototype.stop = function() {
	this.server.close();
	if (this.watcher) this.watcher.close();
};

LocalServer.prototype.deploy = function() {
	var FASTACK = this.FASTACK;
	var self = this;
	return new Promise(function(resolve, reject) {

		var allowable = [
			'js',
			'html'
		];

		FASTACK.traverse(FASTACK.cwd, allowable, function(file) {}).then(
			function(files) {
				var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
				console.log("DEBUG: API Key: " + FASTACK.apiKey);
				console.log("DEBUG: User key: " + FASTACK.userKey);
				for (var i in files) {
					var file = files[i];
					var filePath = file.path;
					var iterator = filePath.length-1;
					var str = filePath.substring(iterator, iterator+1);
					iterator--;
					var fileName = "";
					while( !(str === "/") && iterator>=0 ){
						fileName = fileName.concat(str);
						str = filePath.substring(iterator, iterator+1);
						iterator--;
					}
					fileName = fileName.split("").reverse().join("");
					console.log("DEBUG: ")
					console.log("Name of file to be uploaded: ");
					console.log(fileName);
					console.log("Path of file to be uploaded: ");
					console.log(file.path);
					console.log("");
					var file_object = {
						filename: fileName,
					    data: fs.readFileSync(filePath)
					};
					// console.log("File data: ");
					// console.log(file_object.data);
					fastack.class('files').dataobject().add( file_object, function(){} ).then(function(data){
						console.log(data);
					}
						);
				}
				resolve();
			}
		);

	})
};

module.exports = function(FASTACK) {
	return new Promise(function(resolve, reject) {
		FASTACK.localServer = new LocalServer(FASTACK);

		if (FASTACK.app) {
			jspm.install(true)
			.then(function() {
				FASTACK.localServer.build()
				.then(function() {
					FASTACK.localServer.start();
					resolve();
				})
			})
		} else {
			FASTACK.localServer.start();
			resolve();
		}

	});

};