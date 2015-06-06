
# css-compat

  **This plugin is included in core Duo**

  Duo plugin to support the component "styles" array and dependencies with CSS assets for backwards compatibility.

  This will only trigger on `css` files and if the component you are downloading has a `styles: [...]` array.

## Future Components

  This plugin does slow Duo down a bit when it triggers, so I urge you to write future CSS components that use the new `@import` syntax. This has the added benefit of only requiring what you actually use and ensuring proper ordering of CSS assets.

## Installation

```bash
$ npm install duo-css-compat
```

## Usage

API:

```js
var compat = require('duo-css-compat');

Duo(root)
  .entry('index.css')
  .use(compat())
  .run(fn);
```

CLI:

```
$ duo --use duo-css-compat
```

## Test

```bash
$ npm install
$ make test
```

## License

(The MIT License)

Copyright (c) 2014 Matthew Mueller &lt;mattmuelle@gmail.com&gt;

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
