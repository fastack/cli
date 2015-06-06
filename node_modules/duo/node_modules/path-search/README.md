# path-search [![npm version](http://img.shields.io/npm/v/path-search.svg?style=flat-square)](https://www.npmjs.org/package/path-search)

> Search files in a path array.

Examples
--------

```
.
├── parent
│   ├── index.html
│   ├── main.css
│   └── main.js
└── child
    ├── index.html
    └── main.css
```

```js
var pathSearch = require('path-search');
var path = ['child', 'parent'];

pathSearch(path, 'index.html') === 'child/index.html';
pathSearch(path, 'main.css') === 'child/main.css';
pathSearch(path, 'main.js') === 'parent/main.js';
pathSearch(path, 'troll') === undefined;
```
