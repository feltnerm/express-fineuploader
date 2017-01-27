var fs = require('fs')
var path = require('path')

var async = require('async')
var mkdirp = require('mkdirp')

var fsHelpers = require('../../lib/fs-helpers.js')

function mktmpFile (size, path, cb) {
  var content = ''

  for (var i = 0; i < size; i++) {
    content = content + '0'
  }

  fs.writeFile(path, content, cb)
}

function mktmpFiles (n, size, uuid, filename, baseUploadDirectory, finalUploadDirectory, isChunked, chunksDirectory, cb) {
  size = size || 100

  var destination = fsHelpers.generateDestination(uuid, baseUploadDirectory, finalUploadDirectory, true, chunksDirectory)

  mkdirp(destination, function (err) {
    if (err) {
      return cb(err)
    }
    async.timesSeries(n, function (i, next) {
      var chunkPath = fsHelpers.generateFilename(uuid, filename, true, i)
      var fullPath = path.join(destination, chunkPath)
      mktmpFile(size, fullPath, function (err) {
        if (!err) {
          return next(null, chunkPath)
        }
        return next(err)
      })
    }, function (err, files) {
      cb(err, files)
    })
  })
}

module.exports = {
  mktmpFile: mktmpFile,
  mktmpFiles: mktmpFiles
}
