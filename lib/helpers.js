const shell = require('shelljs')
	, console2 = require('console2')({disableWelcome: true, override: false})
	;

shell.log = function() {
	FASTACK.logger.info.apply(this, arguments);
};

module.exports = function(FASTACK) {

	FASTACK.shell = shell;
	FASTACK.console2 = console2;

	FASTACK.logger = {
		log: function(msg) {
			console2.log(msg);
		},
		info: function(msg) {
			msg = msg.replace(/\n+$/, "");
			console2.log(msg);
		},
		error: function(msg) {
			msg = msg.replace(/\n+$/, "");
			console2.error(msg);
		},
		warn: function(msg) {
			msg = msg.replace(/\n+$/, "");
			console2.warn(msg);
		},
		confirm: function(msg) {
			msg = msg.replace(/\n+$/, "");
			console2.info(msg)
		},
		object: function(obj) {
			var root = console2.box();

			function traverse(obj, prev) {
				var box = prev.box();
				for (var key in obj) {
					if (typeof obj[key] === 'object') {
						box.line(chalk.cyan(key));
						traverse(obj[key], box);
					}
					else if (typeof  obj[key] === 'array') {
						for (var i in obj[key]) traverse(obj[key], box)
					}
					else box.line(key + ': ' + obj[key])
				}
				box.over();
				return prev;
			}

			traverse(obj, root).out();
		}
	};

	console.log = function(msg) {
		FASTACK.logger.info(msg);
	};

//FASTACK.logger.object({
//	hello: 'world',
//	sub1: {
//		level: 1,
//		something: 1,
//		sub2: {
//			level: 2,
//			sub3: {
//				level: 3
//			}
//		}
//	}
//})

	return new Promise(function(resolve, reject) {
		resolve();
	});
};