
# duo-pack

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

  browser packing for duo. Supports JS & CSS

## Installation

    npm install duo-pack

## Example

```js
// Simple.

var mapping = require('./components/duo.json');
var pack = Pack(mapping);

var js = pack.pack('main.js');
var css = pack.pack('main.css');
```

```js
// UMD.

var mapping = require('./components/duo.json');
var pack = Pack(mapping, { umd: true });

var js = pack.pack('main.js');
var css = pack.pack('main.css');
```

## License

(The MIT License)

Copyright (c) 2014 matthew mueller &lt;mattmuelle@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/duo-pack.svg?style=flat
[npm-url]: https://npmjs.org/package/duo-pack
[travis-image]: https://img.shields.io/travis/duojs/pack.svg?style=flat
[travis-url]: https://travis-ci.org/duojs/pack
