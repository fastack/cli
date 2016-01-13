const Syncano = require('syncano')
	, Path = require('path')
	, fs = require('fs-extra')
	, Promise = require('bluebird')
	;

module.exports = function(FASTACK) {

	return function(args, callback){

		var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});

		function getAppId(name) {
			var appId;
			return new Promise(function(resolve, reject) {
				fastack.class('apps').dataobject().list({"query": {"name": {"_eq": name}}})
					.then((apps) => {
						if (apps.objects && apps.objects[0]) {
							appId = apps.objects[0].id;
							resolve(appId);
						}
						else {
							reject(new Error(name + ' is not an app on Fastack'));
						}
					}).catch((e) => {
						reject(e);
					});
			});
		}

		function deployFile(fileObject) {
			return new Promise(function(resolve, reject) {
				fastack.class('files').dataobject().add(fileObject, function(err, res){
					if (err) reject(err);
					resolve(res);
				});
			});

		}

		function fetchFilesToClean(appId) {
			return new Promise((resolve, reject) => {
				fastack.class('files').dataobject().list({
					"query": {"app": {"_eq": appId}}
				}).then((files) => {
					if (files.objects) resolve(files.objects.map((f) => f.id))
					else resolve([]);
				})
			});
		}

		function cleanFiles(fileIdList) {
			var promises = [];
			for (var i in fileIdList) {
				var id = fileIdList[i];
				promises.push(fastack.class('files').dataobject(id).delete());
			}
			return Promise.all(promises);
		}

		fs.emptyDirSync(Path.resolve(FASTACK.localDir, 'deploy/'));
		var appId, files, filesToClean;
		FASTACK.export('.fastack/deploy')
		.then((f) => new Promise((resolve) => {files = f; resolve()}))
		.then(() => getAppId(args["app-name"]))
		.then((id) => new Promise((resolve) => {appId = id; resolve()}))
		.then(() => fetchFilesToClean(appId))
		.then((ids) => {filesToClean = ids;})
		.then(() => {
			var promises = [];
			for (var f in files) {
				var file = files[f];
				var path = file.path;
				var isDir = fs.lstatSync(path).isDirectory();
				if (!isDir) {
					var fileObject = {
						path: Path.relative(FASTACK.cwd, file.path),
						app: appId,
						contents: {
							filename: Path.basename(file.path),
							data: fs.readFileSync(file.path, 'utf8')
						},
						owner_permissions: "full"
					};
					promises.push(deployFile(fileObject));
				}
			}
			return Promise.all(promises);
		})
		.then(() => cleanFiles(filesToClean))
		.then(() => {
			fastack.class('files').dataobject().list().then(function(data) {
				console.log(data.length);
				callback();
			})
		})
		.catch((e) => {
			console.log(e);
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