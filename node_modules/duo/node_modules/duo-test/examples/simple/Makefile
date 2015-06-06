
#
# we add `-c make` to duo-test(1)
# because we want duo to run `make`
# on refresh
#

T= ../../bin/duo-test -c make -R tap -P 3000

build.js: test/test.js
	@duo --stdout $< > build.js

test-browser:
	@$(T) browser

test-phantomjs:
	@$(T) phantomjs

test-saucelabs:
	@$(T) -b safari:5..7 saucelabs

.PHONY: test test-saucelabs test-phantomjs
