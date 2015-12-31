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
	, chokidar = require('chokidar')
	, crypto = require('crypto')
	;

function LocalServer(FASTACK) {
	this.FASTACK = FASTACK;
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

LocalServer.prototype.start = function() {
	var FASTACK = this.FASTACK;
	var req = {FASTACK: {}};
	FastackDelivery.configure('development')(req, null, function() {});
	FASTACK.config = req.FASTACK.config;




	var fastackServer = connect();

	fastackServer.use(function(req, res, next) {
		req.FASTACK = {};
		req.FASTACK.config = FASTACK.config;
		next();
	});

	fastackServer.use(FastackDelivery.configure('development'));
	fastackServer.use(FastackDelivery.route());
	fastackServer.use(sendFile(FASTACK));
	fastackServer.use(FastackDelivery.notFound());


	var port = FASTACK.argv.port || FASTACK.config.local.port;
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
			FASTACK.build().then(function() {
				var css = Path.extname(path) == '.css';
				if (css) socket.emit('reload-css');
				else socket.emit('reload');

				spinner.stop();
				FASTACK.vorpal.ui.redraw.done();
			});
		});

	}

};

LocalServer.prototype.stop = function() {
	this.server.close();
	if (this.watcher) this.watcher.close();
};

module.exports = function(FASTACK) {
	return new Promise(function(resolve, reject) {
		FASTACK.localServer = new LocalServer(FASTACK);

		if (FASTACK.app) {
			FASTACK.build()
			.then(function() {
				FASTACK.localServer.start();
				resolve()
			})
			.catch(function(e) {
				reject(e);
			})
		} else {
			FASTACK.localServer.start();
			resolve();
		}

	});

};