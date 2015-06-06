# duo-less

> A LESS plugin for Duo

## Install

```sh
$ npm install --save duo-less
```

## Usage

### CLI

```sh
$ duo --use duo-less
```

### API

```js
var Duo = require('duo');
var less = require('duo-less');

var duo = Duo(__dirname)
    .entry('index.less')
    .use(less());

duo.run(function (err, file) {
    if (err) throw err;

    // file => generated CSS source code
});
```

## Options

If you can figure out the [LESS docs](http://lesscss.org/usage/) about config options,
any of those should work. The `filepath` option is the only one set via this plugin.
(and you likely should not override that one)
