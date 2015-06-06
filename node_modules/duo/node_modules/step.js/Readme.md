
# step.js

  My kind of step library. no dependencies. 73 lines of code. 272 lines of tests.

## Installation

  In the browser (component):

      $ component install matthewmueller/step.js

  In node:

      $ npm install step.js

## Features

  Similar to [ware](https://github.com/segmentio/ware) with a few key differences:

  * transform support, return values update the argument passed through
    while `undefined` will pass the previous value through
  * synchronous, asynchronous & generator support
  * errors skip to end immediately (errors cannot be caught by middleware)

## Example

```js
function fetch(notes, posts, next) {
  // fetch notes and posts
  next(null, notes, posts)
}

function *compare(notes, posts) {
  // compare, update posts if necessary
  return updated;
}

step()
  .use(fetch)
  .use(compare)
  .run(function(err, updated) {
    if(err) throw err;
    console.log(updated);
  });
```

## Installation

With node.js:

    npm install step.js

With component:

    component install matthewmueller/step.js

## API

### `Step([fn|arr|step])`

  Initialize `step`.

### `Step#use(fn|arr|step)`

  Add a step or array of steps to be executed sequentially.

```js
step()
  .use(a)
  .use([b, c])
  .run() // a then b then c.
```

### `Step#run(args..., fn)`

Run the steps passing a variable number of `args` to the first step.
Calls `fn` when all the steps run, or an error is returned.

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
