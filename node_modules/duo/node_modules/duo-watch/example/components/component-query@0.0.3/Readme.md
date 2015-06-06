# query

  Query the DOM with selector engine fallback support. This abstraction
  allows all other components that require dom querying to indirectly support
  old browsers, without explicitly adding support for them.

## Installation

    $ component install component/query

## API

### query(selector, [el])

  Query `selector` against the document or `el`
  and return a single match.

```js
query('ul > li');
query('ul > li', articles);
```

### query.all(selector, [el])

  Query `selector` against the document or `el`
  and return all matches.

```js
query.all('ul > li');
query.all('ul > li', articles);
```

## Fallback engines

  Currently supported:

  - [query-zest](https://github.com/component/query-zest)
  - [query-qwery](https://github.com/jamischarles/query-qwery)

## License

  MIT
