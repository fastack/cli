const Syncano = require('syncano')
	, Path = require('path')
	, fs = require('fs')
	, Promise = require('bluebird')
	;

module.exports = function(FASTACK) {

	return function(args, callback){

		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});

		function getAppId(name) {
			var appId;
			return new Promise(
				function(resolve, reject) {
					fastack.class('apps').dataobject().list({"query": {"name": {"_eq": name}}})
						.then((apps) => {
							if (apps.objects && apps.objects[0]) {
								appId = apps.objects[0].id;
								resolve(appId);
							}
							else {
								FASTACK.logger.warn(args["app-name"] + ' is not an app on Fastack');
								reject();
							}
						}).catch((e) => {
							FASTACK.logger.error(e);
						});
				});
		}

		function deployFile(fileObject) {
			return new Promise(function(resolve, reject) {
				fastack.class('files').dataobject().add(fileObject, function(err, res){
					if (err) reject(err);
					FASTACK.logger.info(res);
					resolve();
				});
			});

		}

		var allowable = [
			'js',
			'html'
		];

		getAppId(args["app-name"])
		.then((id) => {
			FASTACK.traverse(FASTACK.cwd, allowable, function(file) {
				var fileObject = {
					path: Path.relative(FASTACK.cwd, file.path),
					app: id,
					contents: {
						filename: Path.basename(file.path),
						data: fs.readFileSync(file.path, 'utf8')
					}
				};
				console.log(fileObject);
				return deployFile(fileObject);
			})
		}).then(() => {
			fastack.class('files').dataobject().list().then(function(data) {
				callback();
			})
		}).catch(() => {
			callback();
		});

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

	}
};