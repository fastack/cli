const Syncano = require('syncano')
	, fs = require('fs')
	, request = require('request')
	;

module.exports = function(FASTACK) {

	return function(args, callback) {

		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});

		var createAppEndpoint = 'http://api.fastack.io/create-app';
		var userId;
		var appName = args['app_name'];

		FASTACK.getUserId()
			.then((id) => new Promise((resolve, reject) => {
				userId = id;
				request.post(createAppEndpoint, (error, response) => {
					if (error) reject(error);
					resolve(response.headers['location']);
				})
			}))
			.then((redirected) => new Promise((resolve, reject) => {
				request.post(redirected, {
					json: true,
					body: {userId, appName}
				}, (error, response, body) => {
					if (error) reject(error);
					else resolve(body);
				})
			}))
			.finally(() => {
				callback();
			})

	}

};