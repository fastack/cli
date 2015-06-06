
test: node_modules
	@node_modules/.bin/mocha \
		--reporter spec \
		--timeout 8s

node_modules: package.json
	@npm install
	@touch $@

.PHONY: test
