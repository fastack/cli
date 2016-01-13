const fs = require('fs')
	, Syncano = require('syncano')
	, validator = require('validator')
	, request = require('request')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		const self = this;

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
			var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
			// fastack.webhook('register').run(function(){});

			var url = "https://api.syncano.io/v1/instances/fastack/webhooks/p/e0069d7708abccb1bcf09b0b8bc98bec71096378/register/"

			request(url, function (err, res) {
			  if (err) {console.log(err); return;}
			  console.log(res.body);
			});

			callback();
			// account.instance('INSTANCE_NAME').webhook('WEBHOOK_NAME').run(callback());
			// if( answers.email ){ // we only need to account for e-mail bc this.prompt already ensures a username and pw is entered
			// 	var payload = {"payload":{'apiKey': FASTACK.apiKey,'username': answers.username, 'password': answers.password, 'email':answers.email}};
			// 	fastack.codebox(6).run(payload, function(){});
			// 	callback();
			// } else {
			// 	FASTACK.logger.log("You must enter an e-mail address. Please try again.");
			// 	callback();
			// }

		});

	}
};