const Syncano = require('syncano')
	, Path = require('path')
	, fs = require('fs')
	;

module.exports = function(FASTACK) {

	return function(args, callback){

		return new Promise(function(resolve, reject) {

			var allowable = [
				'js',
				'html'
			];

			FASTACK.traverse(FASTACK.cwd, allowable, function(file) {}).then(
				function(files) {
					console.log(FASTACK.cwd);
					var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
					console.log("DEBUG: API Key: " + FASTACK.apiKey);
					console.log("DEBUG: User key: " + FASTACK.userKey);
					for (var i in files) {
						var file = files[i];
						var object = {
							path: Path.basename(file.path),
							app: 2,
							contents: {
							filename: Path.basename(file.path),
							data: fs.readFileSync(file.path)
						  }
						};
						fastack.class('files').dataobject().add( object, function(err, res){
							if (err) {
								console.log(err);
							}
							console.log(res.path + " successfully deployed");
						} );
					}
					// fastack.class('files').dataobject().list({}).then(function(data) {
					// 	console.log(data.objects);
					// })
					resolve();
				}
			);

		})
	}
};