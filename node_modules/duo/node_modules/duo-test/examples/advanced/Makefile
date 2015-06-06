
#
# we add `-c make` to duo-test(1)
# because we want duo to run `make`
# on refresh
#

T= ../../bin/duo-test -c make

build.js: test/test.js
	@duo --stdout $< > build.js

test-browser:
	@$(T) browser

test-phantomjs:
	@$(T) phantomjs

test-saucelabs:
	@$(T) saucelabs -b safari:6..7

.PHONY: test test-saucelabs test-phantomjs
