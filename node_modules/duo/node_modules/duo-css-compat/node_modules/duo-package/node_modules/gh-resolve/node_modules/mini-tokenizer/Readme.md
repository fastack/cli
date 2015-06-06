
# mini-tokenizer

  tiny tokenizer for simple parsing.

## Installation

  Install with [component(1)](http://component.io):

    $ component install matthewmueller/mini-tokenizer

## Example

```js
var tokenize = require('mini-tokenizer');

// regex for U.S. telephone numbers (incomplete)
var rtelephone = /(\d{3})[\-\. ]?(\d{3})[\-\. ]?(\d{4})/g

// compile the tokenizer
var tokens = tokenize(rtelephone, '+1 ($1) $2-$3');

// tokenize the input
var input = '782.312.5313, 902 534 6245, 324-342-6666';
tokens(input) // [ '+1 (782) 312-5313', '+1 (902) 534-6245', '+1 (324) 342-6666' ]
```

## API

### tokenize(regex, str|fn)

Create a tokenize function with the given `regex`. You may also format each token using a `str` or `fn`. The formatter has support for the following variables:

- `$&` or `$0`: replace with the original match
- `$nn`: replace with the nth matched group
  
Tokenize returns a compiled `fn` that can be used to tokenize and format the input

## TODO

- tests
- rename? (not sure what the proper term is for this library)

## License

  The MIT License (MIT)

  Copyright (c) 2014 <copyright holders>

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
