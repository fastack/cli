
BIN := node_modules/.bin
REPORTER ?= spec
SRC = $(wildcard *.js)
TESTS = $(wildcard test/*.js)

test: node_modules
	@$(BIN)/mocha --reporter $(REPORTER)

coverage: node_modules $(SRC) $(TESTS)
	@$(BIN)/istanbul cover \
	  $(BIN)/_mocha -- \
	    --reporter $(REPORTER)

node_modules: package.json
	@npm install
	@touch node_modules

clean:
	@rm -rf coverage

.PHONY: clean test
