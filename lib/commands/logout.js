const fs = require('fs')
	, Syncano = require('syncano')
	;

module.exports = function(FASTACK) {
	return function(args, callback) {
		fs.unlinkSync(FASTACK.globalConfig);
		FASTACK.userKey = null;
		FASTACK.syncano = new Syncano({
			instance: 'fastack',
			apiKey: FASTACK.apiKey
		});
		FASTACK.logger.info('Successful logout.');
		callback();
	}
};