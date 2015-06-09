# Fastack
Fastack is a zero-configuration development tool that makes building client-side-only apps a breeze. Run `$ fastack` in your app directory to automatically enable the following features.

## Features
### Easy package management
Fastack uses DuoJS to manage front-end dependencies. Simply `require` a library or file to use.

- Use a local javascript file `require('./local-file.js')`
- Use a package on github `require('matthewmueller/uid')`
- Use a local CSS file  `@import local-file.css`
- Use some CSS on github `@import 'necolas/normalize.css'`
- JSON and HTML can also be require'd into your code: `require('./options.json')`

More information on using DuoJS packages can be found here: [http://duojs.org/](http://duojs.org/)

### Pre-compiler support
- LESS CSS
- CoffeeScript

Pre-compiled languages are detetected and automatically compiled and delivered.

### Source mapping
Inline source maps are generated in development mode.

### Live reload
Live reloading is automatically inserted into your application. Full page reloads when javascript, html or configurations are change, only CSS is refreshed when styles are changed.


## Installation
```
$ npm install -g fastack
```

## Getting Started