var mkdirp = require('mkdirp')

var fsHelpers = require('../fs-helpers')
var helpers = require('../helpers')

var multerChunkedDiskStorage = function multerChunkedDiskStorage (options) {
  return {
    destination: function (req, file, cb) {
      req.upload = helpers.mapRequestBodyToUploadParams(req.body, options.uploadRequestParameters)
      var uuid = req.upload.uuid
      var baseUploadDirectory = options.baseUploadDirectory
      var finalUploadDirectory = options.finalUploadDirectory
      var chunksDirectory = options.chunksDirectory
      var isChunked = req.upload.partIndex && req.upload.partIndex >= 0
      var directory = fsHelpers.generateDestination(uuid, baseUploadDirectory, finalUploadDirectory, isChunked, chunksDirectory)

      mkdirp(directory, function (err) {
        if (err) {
          return cb(err, directory)
        }
        return cb(null, directory)
      })
    },
    filename: function (req, file, cb) {
      req.upload = helpers.mapRequestBodyToUploadParams(req.body, options.uploadRequestParameters)
      var uuid = req.upload.uuid
      var inputFilename = req.upload.filename
      var partIndex = req.upload.partIndex
      var isChunked = req.upload.partIndex && req.upload.partIndex >= 0

      var filename = fsHelpers.generateFilename(uuid, inputFilename, isChunked, partIndex)
      cb(null, filename)
    }
  }
}

module.exports = multerChunkedDiskStorage
