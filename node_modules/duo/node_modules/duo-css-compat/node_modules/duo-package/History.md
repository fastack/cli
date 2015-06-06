
0.5.1 / 2014-10-27
==================

  * lazy-load request

0.5.0 / 2014-10-24
==================

  * added: optional authentication
  * package: Update debug and gnode
  * update test for new github status code
  * test: Verify invalid-semvers can be handled
  * package.json: Bump gh-resolve for invalid semver support

0.4.2 / 2014-08-03
==================

 * add 'installing' and 'install' events

0.4.1 / 2014-08-02
==================

 * bump gh-resolve
 * package.json: Add missing mkdirp dep

0.4.0 / 2014-08-02
==================

 * support callbacks
 * follow renamed repos
 * changed Package#auth(user, token) to Package#token(token) since user is no longer necessary
 * simplifying node v0.10 support via gnode
 * add curl cmd to debug()
 * clean up Package#debug() & Package#error()
 * remove abort

0.3.4 / 2014-07-12
==================

 * fix: dont cache branches

0.3.3 / 2014-07-12
==================

 * fix: typo
 * fix resolve event
 * fix event removal

0.3.2 / 2014-07-11
==================

 * fix "resolve" event

0.3.1 / 2014-07-11
==================

 * fix event removal
 * more debug statements while resolving

0.3.0 / 2014-07-11
==================

 * test zlib extraction before writing tarball to cache
 * checks if pkg already exists.
 * added progress events
 * remove duo-cache
 * much more reliable downloads

0.2.13 / 2014-07-08
==================

 * added bootstrap test

0.2.12 / 2014-07-08
==================

 * stream fixes

0.2.11 / 2014-07-08
==================

 * add auth error

0.2.10 / 2014-07-03
==================

 * duo-package: add env auth back

0.2.9 / 2014-07-03
==================

 * clean up ~/.netrc auth
 * update gh-resolve

0.2.8 / 2014-06-24
==================

 * added mocha.opts
 * fix: stream races

0.2.7 / 2014-06-23
==================

 * fix: header check, this time for real

0.2.6 / 2014-06-23
==================

 * fix header check, closes #20

0.2.5 / 2014-06-23
==================

 * bump gh-resolve
 * speed up require by removing download and better-error packages

0.2.4 / 2014-06-12
==================

 * add enstore as a dep

0.2.3 / 2014-06-12
==================

 * fix: cannot pipe after "data" has been emitted
 * add some tests

0.2.2 / 2014-06-11
==================

 * perf: no need to resolve branches
 * resolve: use gh api to resolve semver, makes it a lot easier to test on travis

0.2.1 / 2014-06-11
==================

 * add: env gh-auth

0.2.0 / 2014-06-10
==================

 * pin duo-cache
 * Merge pull request #12 from component/perf/resolve
 * perf: dont resolve when a valid semver is given as ref
 * Merge pull request #11 from component/update/gh-resolve
 * deps: update to gh-resolve@1.x
 * depend on duo-cache master for now.
 * cleanup thunkify
 * update comment
 * cache tarballs in /tmp/duo. fixes: #8
 * let gh-resolve throw descriptive error
 * remove fs.exists() usage in parallel .fetch() to prevent race conditions
 * add: duo-cache
 * fix: handle inflight requests

0.1.2 / 2014-05-29
==================

 * optionally use the colon ex: Package('component:events')
 * bump gh-resolve

0.1.1 / 2014-05-29
==================

 * only check .netrc once
 * fetch using 'download' instead of 'co-req'. fixes inconsistent dropped requests and half downloaded packages

0.1.0 / 2014-05-29
==================

 * bring in gh.options fn.
 * add better errors.
 * automatically pull in netrc details
 * add #path([path])
 * add "resolving" & "resolve" events, for logging
 * .resolve() better error messages
 * improve caching a bit
 * dont replace slashes
 * replace slashes with dashes on branch names
 * add events
 * update readme

0.0.10 / 2014-04-08
==================

 * bump co-req.
 * fix error throwing.
 * more debug statements
 * update error with status code

0.0.9 / 2014-04-05
==================

 * update decompress api
 * check response length of fetched content

0.0.8 / 2014-04-05
==================

 * bump decompress to 0.2.2

0.0.7 / 2014-04-05
==================

 * added debug().
 * ensure consistent content-length.
 * don't fetch if we already have

0.0.6 / 2014-03-30
==================

 * update docs. change name from gh-package => duo-package

0.0.5 / 2014-03-03
==================

 * return content body, not json response

0.0.4 / 2014-03-03
==================

 * fix package#read(path) for private repos

0.0.3 / 2014-03-01
==================

 * add pkg.slug()/toString(). fix dir.

0.0.2 / 2014-03-01
==================

 * update to resolve branch refs
 * lookup => resolve

0.0.1 / 2014-03-01
==================

 * Initial release
