
## gh-resolve

  Resolves a semver version / branch name to git ref.

## Example

```js
resolve('component/component@0.19.6', user, tok, function(err, ref){
  if (err) return done(err);
  assert('6d6501d002aef91f1261f6ec98c6ed32046fe46a' == ref.sha);
  assert('0.19.6' == ref.name);
  assert('tag' == ref.type);
  done();
});
```

## License

  (MIT)
