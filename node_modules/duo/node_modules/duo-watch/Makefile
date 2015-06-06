BIN := ./node_modules/.bin

test: node_modules
	@$(BIN)/gnode $(BIN)/_mocha \
		--harmony-generators \
		--reporter spec \
		--require co-mocha

node_modules: package.json
	@npm install
	@touch node_modules

example:
	@duo \
		--root example \
		example/app/{admin,home}/*.js
	@node example/

.PHONY: example test
