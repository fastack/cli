
3.0.4 / 2015-05-01
==================

  * Ensuring all source-map files are "absolute" paths. (from the duo root)

3.0.3 / 2015-05-01
==================

  * Specifying `/require.js` to make sure it stays at the root of the source-map.

3.0.2 / 2015-04-24
==================

  * Adding debug output

3.0.1 / 2015-04-10
==================

  * Using source-root internally

3.0.0 / 2015-03-28
==================

  * Adjusting the returned object to more intelligently include source-maps inline automatically.

2.0.0 / 2015-03-02
==================

  * Returning a `{ code, map }` object instead of raw `String` (to work towards external source-maps)

1.0.12 / 2015-03-01
===================

  * Merging inline source-maps into the final source-map

1.0.11 / 2015-01-08
===================

  * Applies wrapper offset to sourcemaps
  * add test for seajs(cmd) support
  * add seajs(cmd) support

1.0.10 / 2014-10-24
===================

  * add umd support

1.0.9 / 2014-09-24
==================

 * Fixed: sourcemap off-by-one (@ryanfields)
 * Added: Travis
 * Fixed: sourcemap test (@stephenmathieson)
 * Fixed: Don't expose file info in sourcemap (@stephenmathieson)
 * Update: gnode

1.0.8 / 2014-09-12
==================

 * fix css getting included twice. see: https://github.com/duojs/duo/issues/321

1.0.7 / 2014-08-30
==================

 * css assets should be relative to the entry

1.0.6 / 2014-08-26
==================

 * do not duplicate different @import deps that resolve to the same source
 * support node 0.10.x using $ mocha
 * Merge pull request #17 from duojs/node_0.10
 * Makefile: Reorder targets
 * Makefile: fix test target
 * using gnode for node 0.10 backwards compat
 * cleaning up the makefile some, using gnode to run tests

1.0.5 / 2014-08-20
==================

 * do not remove duplicate assets

1.0.4 / 2014-08-20
==================

 * use relative paths for copied/symlinked assets

1.0.3 / 2014-08-16
==================

 * make sure imports only get loaded once

1.0.2 / 2014-08-03
==================

 * bump file-deps to fix symlinks and improve test coverage
 * fix for empty css files
 * test: Fix sourcemap fixture

1.0.1 / 2014-07-02
==================

 * tests: add sourcemaps test
 * fix: sourcemaps
 * add dev deps

1.0.0 / 2014-06-30
==================

 * refactored lib and api
 * add css support

0.1.1 / 2014-06-18
==================

 * fix: sourcemaps

0.1.0 / 2014-06-10
==================

 * tests: make sure require() doesnt use any previously defined requires
 * tests: add global check
 * add global option
 * add ability to require from outside the build
 * cleanup require impl
 * add tests
 * return the source when path is not given, closes #2

0.0.4 / 2014-04-09
==================

 * added source-maps

0.0.3 / 2014-03-30
==================

 * added mkdirp to pack

0.0.2 / 2014-03-07
==================

 * Initial release
