
0.4.0 / 2015-05-11
==================

  * Add ability to use local PhantomJS installation
  * Minor testing and documentation fixes

0.3.13 / 2014-12-29
==================

  * make: increase tests timeout
  * update wd-browser, closes #62
  * add travis.yml
  * examples/simple: Use "tap" reporter
  * bin: Fix reporter name casing

0.3.12 / 2014-11-07
==================

  * browser: Fix 'duo-test browser firefox'

0.3.11 / 2014-10-29
==================

 * cli: noop
 * load middleware
 * package: Run npm init

0.3.10 / 2014-10-09
==================

 * examples: add fatal error example
 * phantomjs: handle fatal errors
 * client: add .onerror handler
 * better debugs()

0.3.9 / 2014-10-08
==================

 * duo-test.js: ignore suite parent

0.3.7 / 2014-10-07
==================

 * docs
 * add --port

0.3.6 / 2014-10-05
==================

 * deps: update co-timeout for numbers fix

0.3.5 / 2014-09-30
==================

 * accept common saucelabs env variable names [staygrimm]

0.3.4 / 2014-09-19
==================

 * package.json: Update gnode to 0.1.0
 * remove unused func.

0.3.3 / 2014-09-08
==================

 * send noop duotest() when in local browser mode
 * client: Remove mocha.{js,css} [stephenmathieson]
 * lib: Use mocha.{js,css} from npm [stephenmathieson]
 * examples: Add a non-trivial "library" example [stephenmathieson]
 * spawn command with gnode like with duo [queckezz]
 * use correct mime-type shortcut [staygrimm]

0.3.2 / 2014-08-21
==================

 * duo-test(1): respect -B argument

0.3.1 / 2014-08-21
==================

 * deps: add mocha

0.3.0 / 2014-08-21
==================

 * docs: fix wording
 * docs: links
 * Merge pull request #25 from component/docs
 * Rewrite :D
 * Merge pull request #22 from component/refactor
 * html: fix typos
 * add advanced example
 * runner: use default phantomjs
 * deps: install phantom pkgs by default
 * saucelabs: fix typo
 * koa: yield next fail
 * duo-test(1): change default path to /test
 * duo-test(1): exit on SIGINT
 * add default mocha
 * add default.html
 * duo-test(1): add --harmony-generators flag
 * pkg: remove bins
 * examples: removeem for now
 * cli: destroy runner on SIGINT
 * api: add runner.destroy()
 * cli: refactor + cleanup
 * api: make some methods private
 * saucelabs: add 404 edge-case example
 * saucelabs: better timeout error message
 * saucelabs: typo
 * saucelabs: .tok -> .key
 * saucelabs: add .url()
 * saucelabs: remove unused vars
 * saucelabs: add .register(browser)
 * saucelabs: add .debug()
 * saucelabs: start() -> run()
 * saucelabs: add browser abstraction
 * tests: bail and lower timeout
 * saucelabs: rebuild client source
 * saucelabs: handle race condition
 * saucelabs: handle messageless stack traces
 * saucelabs: use encode/decode uri component
 * add saucelabs example
 * saucelabs: upgrade wd-browser to 1
 * saucelabs: concat .msg to .stack
 * add mocha phantomjs example
 * client: rebuild
 * saucelabs: ocd
 * saucelabs: ocd
 * docs: add usage
 * remove co-parallel
 * middleware: add better errors
 * Merge pull request #18 from component/fix/test
 * Add how to test to readme
 * fix test and punctuation

0.2.4 / 2014-07-11
==================

 * duo-test-saucelabs(1): default path to /test

0.2.3 / 2014-07-10
==================

 * fix: typo preventing a command from running on every load
 * app.js: Fix 'koa' typo [stephenmathieson]

0.2.2 / 2014-07-09
==================

 * add middleware, closes #13

0.2.1 / 2014-07-07
==================

 * duo-test-browser(1): commands fix

0.2.0 / 2014-07-03
==================

 * fix: ie6-8 and add tests
 * debugmode: listen on 3000
 * app: allow .listen(port)

0.1.3 / 2014-07-01
==================

 * wd-browser: update to 0.1 to get android and opera

0.1.2 / 2014-07-01
==================

 * fix: all --help
 * duo-test(1): show help if a command is omitted
 * tests: enable all
 * duo-test(1): fix some typos

0.1.1 / 2014-07-01
==================

 * saucelabs: support $BROWSER
 * tests: remove ie6-8 for now
 * tests: mocha-send.js -> saucelabs.js

0.1.0 / 2014-07-01
==================

 * phantomjs: add commands support
 * saucelabs: quit callback
 * saucelabs: speedup
 * saucelabs: add --name option
 * saucelabs: add debug mode
 * saucelabs: rename mocha-events.js to saucelabs.js, closes #8
 * saucelabs: dont quit before "end" event is received
 * fix: browser conf
 * saucelabs: remove queue timeout, maybe queue-component bug
 * saucelabs: dont send tests and suites array to keep requests small
 * saucelabs.js: use jsonp
 * saucelabs: make sure events are sent in order
 * add app.expose()

0.0.3 / 2014-06-25
==================

 * add default browser

0.0.1 / 2014-06-25
==================

 * add default browser
 * pass all args after -- to phantomjs
 * duo-test(1): test with phantomjs when no command is given
 * add open in browser commands
 * Initial commit
