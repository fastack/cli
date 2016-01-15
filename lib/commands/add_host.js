const fs = require('fs')
	, Syncano = require('syncano')
	, validator = require('validator')
	, request = require('request')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, jspm = require('jspm')
	, chalk = require('chalk')
	, Promise = require('bluebird')
	;

module.exports = function(FASTACK) {

	return function(args, callback){

		var hostName = args["host-name"];

		function addHost(url, info) {
			return new Promise(function(resolve, reject) {
				request.post(url, {json:{info}} , function (err, res) {
				  if (err) {
				  	reject(err);
				  	return;
				  }
				  resolve( res.body.result.stdout );
				});
			});
		}

		var url = "https://api.syncano.io/v1/instances/fastack/webhooks/p/0acce994a35c9512e9c0a4960853d00483f95209/create_host/";
		var spinner = new Spinner('Adding host');
		var info = { hostName: hostName, apiKey: FASTACK.apiKey, userKey: FASTACK.userKey };
		spinner.start();
		addHost(url, info).then( (result) => {
			spinner.stop();
			FASTACK.logger.log(result);
			callback();
		}).catch((e) => {
			spinner.stop();
			FASTACK.logger.error(e);
			callback();
		});

	}
};