
# duo-main

  Figure out the entry into a component. Supports component's existing manifest format, while adding enhancements for Duo.

## API

### main(json)

This manifest is considered an entry. Fetch all the entries from `json`, returning an array.

```json
{
  "main": "index.js",
  "styles": [ "index.css" ]
}
```

```js
main(json) // [ "index.js", "index.css" ]
```

### main(json, type)

This manifest is considered a dependency with an established type. Given the `type`, fetch a single entry point.

```json
{
  "main": "index.js",
  "styles": [ "index.css" ]
}
```

```js
main(json, 'css') // "index.css"
```

## Test

```
npm install
make test
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
