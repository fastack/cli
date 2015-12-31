const Syncano = require('syncano')
	, fs = require('fs')
	;

module.exports = function(FASTACK) {

	return function(args, callback) {

		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});

		var object = {
			name: args.app_name
		};

		fastack.class('apps').dataobject().add(object, function(err, res){
			if (err) {
				console.log(err);
			}
			console.log(res.name + " successfully created");
			callback();
		} );


	}

};