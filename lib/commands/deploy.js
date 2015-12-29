const Syncano = require('syncano')
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
					var fastack = new Syncano({instance: 'fastack', apiKey: FASTACK.apiKey, userKey: FASTACK.userKey});
					console.log("DEBUG: API Key: " + FASTACK.apiKey);
					console.log("DEBUG: User key: " + FASTACK.userKey);
					for (var i in files) {
						var file = files[i];
						var filePath = file.path;
						var iterator = filePath.length-1;
						var str = filePath.substring(iterator, iterator+1);
						iterator--;
						var fileName = "";
						while( !(str === "/") && iterator>=0 ){
							fileName = fileName.concat(str);
							str = filePath.substring(iterator, iterator+1);
							iterator--;
						}
						fileName = fileName.split("").reverse().join("");
						console.log("DEBUG: ")
						console.log("Name of file to be uploaded: ");
						console.log(fileName);
						console.log("Path of file to be uploaded: ");
						console.log(file.path);
						console.log("");
						var file_object = {
							filename: fileName,
						    data: fs.readFileSync(filePath)
						};
						// console.log("File data: ");
						// console.log(file_object.data);
						fastack.class('files').dataobject().add( file_object, function(){} ).then(function(data){
							console.log(data);
						}
							);
					}
					resolve();
				}
			);

		})
	}
};