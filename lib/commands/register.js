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
	return function(args, callback) {
		const self = this;

		function registerUser(url, answers) {
			return new Promise(function(resolve, reject) {
				request.post(url, {json:{answers}} , function (err, res) {
				  if (err) {
				  	reject(err);
				  	return;
				  }
				  resolve( res.body.result.stdout );
				});
			});
		}

		this.prompt([
			{
				type: 'input',
				name: 'username',
				message: 'Fastack username: '
			},
			{
				type: 'input',
				name: 'email',
				message: 'Email: '
			},
			{
				type: 'password',
				name: 'password',
				message: 'Fastack password: '
			}
		], function(answers) {
			// var url = "http://api.fastack.io/register?username="+answers.username+"&password="+answers.password+"&email="+answers.email+"&apiKey="+FASTACK.apiKey;
			// var url = "https://api.syncano.io/v1/instances/fastack/webhooks/p/e0069d7708abccb1bcf09b0b8bc98bec71096378/register/?username="+answers.username+"&password="+answers.password+"&email="+answers.email+"&apiKey="+FASTACK.apiKey;
			var url = "https://api.syncano.io/v1/instances/fastack/webhooks/p/e0069d7708abccb1bcf09b0b8bc98bec71096378/register/";
			var spinner = new Spinner('Registering user');
			answers.apiKey = FASTACK.apiKey;
			spinner.start();
			registerUser(url, answers).then( (result) => {
				spinner.stop();
				FASTACK.logger.log(result);
				callback();
			}).catch((e) => {
				spinner.stop();
				FASTACK.logger.error(e);
				callback();
			});

		});

	}
};