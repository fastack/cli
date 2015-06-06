
all: client/build.js client/default.js

client/build.js: client/duo-test.js
	@duo --global duotest $< > $@

client/default.js: client/default.html
	@node_modules/.bin/minstache < $< > $@

test:
	@node_modules/.bin/mocha \
		--harmony-generators \
		--require co-mocha \
		--timeout 10s \
		--reporter spec \
		--bail

clean:
	rm -f client/build.js
	rm -f client/default.js
	rm -rf components

.PHONY: test clean
