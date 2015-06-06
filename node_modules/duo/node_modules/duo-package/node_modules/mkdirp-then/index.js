
var _mkdirp = require('mkdirp')
var Promise = require('native-or-bluebird')

module.exports = function (dir) {
  return new Promise(function (resolve, reject) {
    _mkdirp(dir, function (err) {
      if (err) reject(err)
      else resolve()
    })
  })
}
