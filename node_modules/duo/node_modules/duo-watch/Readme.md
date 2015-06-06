
# duo-watch

  Watch for any changes in the file dependency tree and rebuild from the entry file.

## Installation

```
npm install duo-watch
```

## Example

```js
Watcher(root).watch(function(file) {
  console.log('changed: %s', file);

  var duo = Duo(root)
   .entry(file)

  duo.run = co(duo.run);

  duo.run(function(err) {
    err && console.error(err);
    console.log('rebuilt: %s', file);
  });
});
```

## API

### `Watcher(root, [glob])`

  Watch files from the `root`. Optionally pass a `glob`, to narrow down the files you watch. `glob` defaults to `**/*.{js,css,html}`.

### `watch(fn)`

  Call `fn` whenever an entry file or its dependencies changes. Watch will pass the top-level entry files as to the function as `function(file) { ... }`. If one change affects multiple bundles, the function will be called for each entry.

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
