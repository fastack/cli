const Syncano = require('syncano')
	, Path = require('path')
	, fs = require('fs-extra')
	, Promise = require('bluebird')
	, walkSync = require('walk-sync')
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

		var appId, dir, filesToClean;
		FASTACK.export('.fastack/deploy')
		.then((d) => {dir = d; return getAppId(args["app-name"])})
		.then((id) => {appId = id; return fetchFilesToClean(appId)})
		.then((ids) => {filesToClean = ids;})
		.then(() => {
			var promises = [];
			var files = walkSync(dir, {directories: false});
			for (var f in files) {
				var file = Path.resolve(dir, files[f]);
				var fileObject = {
					path: Path.relative(dir, file),
					app: appId,
					contents: {
						filename: Path.basename(file),
						data: fs.readFileSync(file, 'utf8')
					},
					owner_permissions: "full"
				};
				promises.push(deployFile(fileObject));
			}
			return Promise.all(promises);
		})
		.then((deployed) => {
			FASTACK.logger.confirm(deployed.length + ' files deployed.');
		})
		.catch((e) => {
			FASTACK.logger.error(e);
			callback();
		})
		.then(() => cleanFiles(filesToClean))
		.finally(callback);
	}
};