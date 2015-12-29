const Syncano = require('syncano')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, os = require('os')
	, Path = require('path')
	, fs = require('fs')
	, request = require('request')
	, Promise = require('bluebird')
;
var syncanoKey = function() {
	return new Promise(function(resolve, reject) {
		request('http://api.fastack.io/cli-api-key', function(error, response, body) {
			if (error) reject(error);
			var key = JSON.parse(body).result.stdout;
			resolve(key);
		});
	});
};

module.exports = function(FASTACK) {
	return new Promise(function(resolve, reject) {

		var config;
		try {
			config = fs.readFileSync(FASTACK.globalConfig, 'utf8');
			config = JSON.parse(config);
		} catch(e) {
			if (e.code && e.code == 'ENOENT') { // file not found
				config = {};
			}
		}

		FASTACK.userKey = config.userKey;
		FASTACK.apiKey = config.apiKey;


		if (!FASTACK.apiKey) {
			syncanoKey().then(function(key) {
				FASTACK.apiKey = key;
				resolve();
			})
		} else resolve();

	});
};