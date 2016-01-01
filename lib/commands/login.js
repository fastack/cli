const fs = require('fs')
	, Syncano = require('syncano')
	, clui = require('clui')
	, Spinner = clui.Spinner
	, prompt = require('prompt')
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
				message: 'Fastack password: ',
				hidden: true
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

// prompt attempt 2
	// 	  prompt.start();
 
 //  // 
 //  // Get two properties from the user: username and password 
 //  // 
 //  prompt.get([{
 //      name: 'username',
 //      required: true
 //    }, {
 //      name: 'password',
 //      hidden: true,
 //      conform: function (value) {
 //        return true;
 //      }
 //    }], function (err, result) {
 //    // 
 //    // Log the results. 
 //    // 
 //    console.log('Command-line input received:');
 //    console.log('  username: ' + result.username);
 //    console.log('  password: ' + result.password);
 //  });
 //  callback();
	}
};