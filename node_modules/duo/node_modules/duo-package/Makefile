NODE ?= node
NODE_FLAGS ?= $(shell $(NODE) --v8-options | grep generators | cut -d ' ' -f 3)

BIN := ./node_modules/.bin
MOCHA ?= $(NODE) $(NODE_FLAGS) $(BIN)/_mocha

test: node_modules
	@$(MOCHA)

node_modules: package.json
	@npm install

.PHONY: test
