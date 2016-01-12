const fs = require('fs')
	, Syncano = require('syncano')
	, validator = require('validator');
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
			var responses = { username: answers.username, email: answers.email, password: answers.password }

			if( answers.email && validator.isEmail( answers.email ) ){
				fastack.user().add( responses ).then(function(){
					FASTACK.logger.log("Account created.");
					callback();
				}, function(err){
					FASTACK.logger.log("Error info: " + err);
					callback();
				});
			} else {
				FASTACK.logger.log("Not a valid e-mail address. Please try again.");
				callback();
			}

		});
	}
};