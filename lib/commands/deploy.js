const Syncano = require('syncano')
	, Path = require('path')
	, fs = require('fs')
	;

module.exports = function(FASTACK) {

	var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});

	return function(args, callback){
		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
		var allowable = [
			'js',
			'html'
		];

		// var dirName = Path.basename(FASTACK.cwd);
		// var filter = {
		// 	"query" : { id: {"_eq":202} }
		// 	"query" : {"name" : Path.basename(FASTACK.cwd) }
		// 	"query" : {"objects": [
		// 		{"name" : "test-app" }
		// 		]
		// 	}
		// 	"fields": {include: ["app"]}
		// 	"query" : {"objects":[
		// 		{ "name": "null" }
		// 		]
		// 	}
		// };

		// fastack.class('apps').dataobject().list(filter, function(data){
		// 	console.log(data);
		// });

		callback();
		FASTACK.traverse(FASTACK.cwd, allowable, function(file) {}).then(
			function(files) {
				fastack.class('apps').dataobject().list({}).then(function(data){
					var appId = null;
					for(var i in data.objects){
						if( data.objects[i].name == dirName ){
							appId = data.objects[i].id;
						}
					}
					// TODO: handle case where appId doesn't exist
					console.log(appId);
				
					console.log(FASTACK.cwd);
					console.log("DEBUG: API Key: " + FASTACK.apiKey);
					console.log("DEBUG: User key: " + FASTACK.userKey);
					for (var i in files) {
						var file = files[i];
						var object = {
							path: Path.basename(file.path),
							app: appId,
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

					callback();
			})
		});
	}
};