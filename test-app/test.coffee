console.log 'Hello World from Coffee!'

require './test-lib.js'

tpl = require './template.jade'

m = tpl({
  message: 'test'
})

console.log m
