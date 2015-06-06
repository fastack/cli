# Duo Package

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]

A github package installer. Meant to be used with [duo](http://github.com/duojs/duo), but can be used outside of duo. Uses generators.

## Features

- github-style urls
- semver support
- flexible api
- checks local before fetching remote
- private repo support
- automattic `~/.netrc` detection

## Installation

```
npm install duo-package
```

## Example

```js
var pkg = new Package('matthewmueller/cheerio', '0.13.x')
  .token(process.env.token)
  .directory('components');

pkg.fetch(function(err) {
  if (err) throw err;
  console.log('fetched: %s', pkg.slug());
})
```

## API

### Package(name, ref)

initialize a new `Package` with `name` and `ref`, where `name` is a github-style url and `ref` is either a tag or a branch. `ref` supports semver versioning.

Examples:

```js
Package('matthewmueller/uid', '*');
Package('matthewmueller/uid', 'master');
Package('matthewmueller/uid', 'some/feature');
Package('matthewmueller/uid', '~0.1.0');
```

### Package#token(token)

authenticate with github. you can create a new token here: https://github.com/settings/tokens/new.

if the `token` is not present, duo-package will try reading the authentication details from your `~/.netrc`. Here's an example:

```
machine api.github.com
  login user
  password token
```

### Package#directory(dir)

set a directory to install the package in.

### Package.path([path])

Get the path of the fetched package. optionally add a relative `path`.

### Package.useragent([ua])

Get or set the user agent header duo-package uses to make requests. defaults to `duo-package`.

### Package.resolve([fn])

Resolve a package's version

### Package.fetch([fn])

fetch the package. returns a generator that can be yielded in a generator function or wrapped in [co](http://github.com/visionmedia/co).

```js
yield pkg.fetch()
```

### Package.slug()

Return the full package name (ie. `component/emitter@1.0.0`)

## Authors

- [Matthew Mueller](https://github.com/MatthewMueller)
- [Amir Abu Shareb](https://github.com/yields)
- Plus many more wonderful contributors!

## License

The MIT License

Copyright &copy; 2014

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[npm-image]: https://img.shields.io/npm/v/duo-package.svg?style=flat
[npm-url]: https://npmjs.org/package/duo-package
[travis-image]: https://img.shields.io/travis/duojs/package.svg?style=flat
[travis-url]: https://travis-ci.org/duojs/package
