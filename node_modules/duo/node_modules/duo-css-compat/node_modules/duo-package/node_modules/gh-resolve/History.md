
3.1.0 / 2015-02-01
==================

  * index: Default to `master` when there are no tags [stephenmathieson]
  * Makefile: add a `node_modules` target
  * index: Add support for username and password


3.0.4 / 2014-09-24
==================

 * Fix: pass over invalid semver tags
 * test: Fix broken test cases

3.0.3 / 2014-08-16
==================

 * mask: use <token> instead of {{token}}
 * semver: loosen semver compare()

3.0.2 / 2014-08-15
==================

 * mask github token when logging, to prevent hacking

3.0.1 / 2014-08-02
==================

 * bump enqueue
 * remove unusued queue-component

3.0.0 / 2014-08-02
==================

 * bring back `git ls-remote` resolution, refactored old branch

2.0.2 / 2014-07-02
==================

 * added debug

2.0.1 / 2014-07-02
==================

 * only paginate if we haven't found anything yet. for *, fetching heads and tags at same time is slow, so do tags first, then heads
 * fallback to ~/.netrc in tests

2.0.0 / 2014-06-23
==================

 * revert: use github API again
 * better error handling
 * use master if no tags and version == "*"

1.1.2 / 2014-06-11
==================

 * add private repo support

1.1.1 / 2014-06-09
==================

 * fix: pass -c core.askpass=true, to prevent git from asking password.

1.1.0 / 2014-06-09
==================

 * parallel: add spawn limit and retry once on failure

1.0.0 / 2014-06-09
==================

 * api-change: update readme
 * Merge pull request #2 from yields/ls-remote
 * use git ls-remote to fetch refs

0.1.5 / 2014-06-01
==================

 * request: lower amount of requests needed by guessing if the user needs a tag or a branch

0.1.4 / 2014-05-29
==================

 * fix: sort, closes #1
 * add * ref test

0.1.3 / 2014-05-07
==================

 * fix: sort refs

0.1.2 / 2014-05-07
==================

 * fix: support branch names with / in them.

0.1.1 / 2014-05-04
==================

 * fix ref.name

0.1.0 / 2014-05-02
==================

 * add .name
