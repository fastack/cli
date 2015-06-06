
# max

  Max value utility

## Installation

    $ component install component/max

## API

### max(array)

  Return the max value in `array`:

```js
max([1,5,6,1,2,0])
```

### max(array, fn)

  Max value in `array` with callback `fn(val, i)`:

```js
var age = max(users, function(u){ return u.age })
```

### max(array, string)

  Max value in `array` with the given property `string`:

```js
var age = max(users, 'age')
```

# License

  MIT
