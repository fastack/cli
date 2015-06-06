
test: clean node_modules
	@./node_modules/.bin/mocha \
		--harmony-generators \
		--require co-mocha \
		--require gnode \
		--reporter spec \
		--timeout 10s

node_modules: package.json
	@npm install
	@touch node_modules

clean:
	@rm -rf test/fixtures/*/{components,build}

.PHONY: test clean
