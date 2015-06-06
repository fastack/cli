# to-pascal-case

  Convert a string to pascal case.

## Installation

    $ component install ianstormtaylor/to-pascal-case
    $ npm install to-pascal-case

## Example

```js
var pascal = require('to-pascal-case');

pascal('space case'); // "SpaceCase"
pascal('snake_case'); // "SnakeCase"
pascal('dot.case');   // "DotCase"
pascal('weird[case'); // "WeirdCase"
```

## API

### toCamelCase(string)
  
  Returns the pascal-case variant of a `string`.

## License

  MIT
