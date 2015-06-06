BIN := ./node_modules/.bin

test: node_modules
	@$(BIN)/gnode $(BIN)/_mocha

node_modules: package.json
	@npm install

.PHONY: test
