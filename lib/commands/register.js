const fs = require('fs')
	, Syncano = require('syncano')
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
			var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey});
			fastack.user().add({
				username: answers.username,
				password: answers.password
			});
		});
	}
};