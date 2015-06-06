## duo-test

Duo's testing utility.

See the [Demo](https://cloudup.com/c5qdleOudgZ).

#### Features

  - Stream results straight from Saucelabs.
  - Runs all tests in parallel.
  - Hook into the koa app using `--middleware`.
  - Run arbitrary shell commands on refresh using `--command`.
  - Easy Saucelabs browser descripions. (`chrome:35..stable`, `iphone:stable` etc..)
  - Supports all mocha reporters for Saucelabs and PhantomJS.
  - Nice API.

#### Installation

Install duo-test from `npm` with:

```sh
npm install -g duo-test
```

#### Quickstart

See [simple](https://github.com/component/duo-test/tree/master/examples/simple) and [advanced](https://github.com/component/duo-test/tree/master/examples/advanced) examples to get started.

#### CLI

```sh
Usage: duo-test <command> [options]

Commands:

  saucelabs [options]
      run tests using saucelabs

  browser [name]
      run tests using a browser

  phantomjs
      run tests using phantomjs


Options:

  -h, --help               output usage information
  -p, --pathname <path>    tests path, defaults to /test
  -c, --commands <list>    shell commands to run on refresh
  -m, --middleware <file>  a file that exposes a function that accepts koa app
  -t, --title <title>      set a title to your tests [test]
  -B, --build <path>       set the built file path when using the default.html [/build.js]
  -R, --reporter <name>    mocha reporter [dot]
  -P, --port <port>        port, defaults to `0`
  -V, --version            output the version number
```

#### PhantomJS

`duo-test` will first try to use your project's local PhantomJS dependency, and then fall back on a global PhantomJS installation. Make sure PhantomJS is installed either as a devDependency (`npm install --save-dev phantomjs`) or globally (`npm -g install phantomjs`, or follow the instructions on <http://phantomjs.org/>).

### License

The MIT License

Copyright © 2015

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
