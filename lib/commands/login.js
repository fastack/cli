const fs = require('fs')
	, Syncano = require('syncano')
	, clui = require('clui')
	, Spinner = clui.Spinner
;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Logging in...');
		const self = this;

		this.prompt([
			{
				type: 'input',
				name: 'username',
				message: 'Fastack username: '
			},
			{
				type: 'password',
				name: 'password',
				message: 'Fastack password: '
			}
		], function(answers) {
			spinner.start();
			var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey});
			fastack.user().login({username: answers.username, password: answers.password}, function(err, data) {

				var config = {
					userKey: data.user_key,
					apiKey: FASTACK.apiKey
				};

				if (data && data.user_key) fs.writeFileSync(FASTACK.globalConfig, JSON.stringify(config), 'utf8');
				FASTACK.userKey = data.user_key;

				spinner.stop();
				callback();
			});
		});
	}
};