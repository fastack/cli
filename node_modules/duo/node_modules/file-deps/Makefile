
test: node_modules
	@./node_modules/.bin/mocha \
		--bail

node_modules: package.json
	@npm install
	@touch $@

.PHONY: test
