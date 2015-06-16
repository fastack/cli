# Fastack Package Management (FPM)
Specification for a front-end package management tool that enables "instant" integration of packages into an application from multiple sources such as **Github**, **Bower**, **NPM** and **CDNs**.

## Outline
- All JS files should be `require()`'ed starting from a (configurable) entry javascript file.
- All CSS files should be `import`'ed starting from a (configurable) entry css file
- Remote packages should be fetched and stored locally

1. FPM should start with an entry point for javascripts and css, both passed in by the user.
2. FPM examines the entry javascript file looking for `require()` calls
	- if the call is for a local file, include that file in the source. **Precompile if necessary (coffee-script, ES6, etc)**
	- if the call is to a remote package, go and fetch that package and cache a copy locally **Precompile if necessary**
3. FPM examines the entry css file looking for `import` calls
	- if the call is for a local file, include that file in the source. **Precompile if necessary (LESS, SASS, etc)**
	- if the call is to a remote package, go and fetch that package and cache a copy locally 
 

## Sources

### Local
`require('lib/local-lib.js')`

### Github
`require('patrickdevivo/fastack:index.js')`

### Bower
`require('bower:jquery')`

### NPM
`require('npm:jquery')`

### CDN
`require('https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js')`