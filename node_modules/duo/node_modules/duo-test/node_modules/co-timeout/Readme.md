
## co-timeout

  Error on timeout.

```js

function *install(ms){
  yield timeout(ms, function*(){
    yield pkg.resolve('org/project');
    yield pkg.fetch('org/project');
    yield pkg.extract('org/project', '/path/to/org-project');
  });
}

try {
  yield install('100ms');
} catch (e) {
  console.log('retry');
  yield install('500ms');
}
```

### API

##### timeout(ms, thunk|gen)

  Timeout with an error after `ms`.

### License

  (MIT)
