const fs = require('fs')
	, Syncano = require('syncano')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, chalk = require('chalk')
;

module.exports = function(FASTACK) {
	return function(args, callback) {
		var spinner = new Spinner('Logging in...');
		this.prompt([
			{
				type: 'input',
				name: 'username',
				message: 'Fastack username: '
			},
			{
				type: 'password',
				name: 'password',
				message: 'Fastack password: ',
				hidden: true
			}
		], function(answers) {
			spinner.start();
			var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey});
			fastack.user().login({username: answers.username, password: answers.password})
			.then((data) => {
				var config = {
					userKey: data.user_key,
					apiKey: FASTACK.apiKey
				};

				if (data && data.user_key) fs.writeFileSync(FASTACK.globalConfig, JSON.stringify(config), 'utf8');
				FASTACK.userKey = data.user_key;

				spinner.stop();
				FASTACK.logger.info('Successful authentication. Key: ' + chalk.cyan(data.user_key));
				callback();
			})
			.catch((e) => {
				spinner.stop();
				var msg = JSON.parse(JSON.parse(e.message));
				FASTACK.logger.error(msg.detail);
				callback();
			})
		});
	}
};