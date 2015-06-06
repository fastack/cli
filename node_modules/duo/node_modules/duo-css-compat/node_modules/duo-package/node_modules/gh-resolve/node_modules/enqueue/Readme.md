
# enqueue

  queue up async function calls without the overhead. supports concurrency.

## Installation

Node:

```bash
$ npm install enqueue
```

Browser (with [Duo](https://github.com/duojs/duo)):

```js
var enqueue = require('matthewmueller/enqueue');
```

## Example

```js
var enqueue = require('enqueue');
var fn = enqueue(function(ms, msg, done) {
  setTimeout(function() {
    console.log(msg);
    done();
  }, ms)
}, 2); // execute 2 at a time

fn(100, 'one', function(){});
fn(50, 'two', function(){});
fn(75, 'three', function(){});

// execution order: "two", "one", "three"
```

## API

### enqueue(fn, [concurrency])

Queue up `fn` calls, executing `fn` concurrently depending on the value of `concurrency`. `concurrency` defaults to 1, so `fn` calls would be executed sequentially.

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
